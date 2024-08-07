let bufferL = [];
let bufferR = [];

const processorURL = chrome.runtime.getURL('random.js');

let bufferQueue = [];
let stopped = false;

chrome.runtime.onMessage.addListener(async(message, sender, sendResponse) => {
    switch (message.type) {
        case "stop":
            stopped = true;
            sendResponse();
            break;
        case "start":
            stopped = false;
            let video = document.querySelector("video");
            startHookVideo(video);

            bufferQueue = [];
            bufferL = [];
            bufferR = [];

            sendResponse("ok");
            break;
        case "request":
            if (bufferQueue.length == 0) {
                sendResponse();
            } else {
                sendResponse(bufferQueue.shift());
            }
            break;
        case "buffer":
            bufferL = bufferL.concat(message.payload[0]);
            bufferR = bufferR.concat(message.payload[1]);
            sendResponse();
            break;
        default:
    }
});

async function startHookVideo(target) {
    let audioContext = new(window.AudioContext || window.webkitAudioContext)();
    audioContext.sampleRate = 44100;
    let source = audioContext.createMediaElementSource(target);
    await audioContext.audioWorklet.addModule(processorURL);
    const randomNoiseNode = new AudioWorkletNode(
        audioContext,
        "random",
    );
    source.connect(randomNoiseNode);
    randomNoiseNode.connect(audioContext.destination);

    let scriptNode = audioContext.createScriptProcessor(1024, source.channelCount, source.channelCount);
    scriptNode.addEventListener("audioprocess", processAudio);

    source.connect(scriptNode);
    scriptNode.connect(audioContext.destination);

}


function processAudio(audioProcessingEvent) {
    // The input buffer is the song we loaded earlier
    let inputBuffer = audioProcessingEvent.inputBuffer;

    let l = Array.from(inputBuffer.getChannelData(0));
    let r;

    if (inputBuffer.numberOfChannels == 2) {
        r = Array.from(inputBuffer.getChannelData(1));
    } else {
        r = l;
    }

    let result = [l, r];

    bufferQueue.push(result);

    // The output buffer contains the samples that will be modified and played
    let outputBuffer = audioProcessingEvent.outputBuffer;

    // Loop through the output channels (in this case there is only one)
    for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {

        let inputData = inputBuffer.getChannelData(channel);
        let outputData = outputBuffer.getChannelData(channel);

        if (stopped) {

            for (let sample = 0; sample < outputData.length; sample++) {

                outputData[sample] = inputData[sample];
            }

            continue;
        }

        let target = null;
        if (channel == 0) {
            target = bufferL;
        }
        if (channel == 1) {
            target = bufferR;
        }

        if (target != null && target.length >= outputData.length) {

            for (let sample = 0; sample < outputData.length; sample++) {

                outputData[sample] = target[sample];
            }

            target.splice(0, outputData.length);

        } else {
            console.warn("buffer underflow")
        }
    }
}