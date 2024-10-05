let audioWorkletNode;
let currentTab = -1;
let requestLoop;

async function startRequestLoop(tabId) {
    // Prevent processing the same tab multiple times
    if (tabId == currentTab) {
        return;
    }
    // Set the current tab to the provided tabId
    currentTab = tabId;
    chrome.runtime.sendMessage({ type: "tab", payload: currentTab });
    requestLoop = setInterval(() => audioWorkletNode.port.postMessage({ type: "getAudioSignal" }));

    audioWorkletNode.port.onmessage = (event) => {
        // Relay the buffered audio signal from audio processor to sand box
        if (currentTab == tabId && event.data) chrome.runtime.sendMessage({ type: "preProcessedSound", payload: [event.data[0], event.data[1]] });
    }
}

chrome.runtime.onMessage.addListener(async(message, sender, sendResponse) => {
    console.log(message.type)
    switch (message.type) {
        case "stop":
            if (audioWorkletNode) audioWorkletNode.port.postMessage(message);
            if (requestLoop) { clearInterval(requestLoop) }
            currentTab = -1;
            sendResponse();
            break;
        case "processedSounds":
            if (audioWorkletNode) audioWorkletNode.port.postMessage(message);
            sendResponse();
            break;
        case "start":
            // This has be in the first line of the break statement before the following async process
            sendResponse();
            // if the current tab change to a new active tab
            if (currentTab != -1 && message.payload != currentTab) {
                // the payload here is current active tab id
                chrome.tabs.sendMessage(currentTab, { type: "stop", payload: message.payload });
            }

            if (audioWorkletNode) {
                return;
            }
            // Get the video source from DOM tree
            const video = document.querySelector("video");

            // Create Web Audio API's audio source 
            const audioContext = new(window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaElementSource(video);

            // Create Audio Worklet node to process the audio
            const processorURL = chrome.runtime.getURL('random.js');
            audioContext.sampleRate = 44100;
            await audioContext.audioWorklet.addModule(processorURL);
            audioWorkletNode = new AudioWorkletNode(
                audioContext,
                "random"
            );

            // Connect the web audio api's audio source with the audio processing node
            source.connect(audioWorkletNode);
            audioWorkletNode.connect(audioContext.destination);
            audioWorkletNode.port.postMessage(message);
            startRequestLoop(message.payload);
            break;

    }
});