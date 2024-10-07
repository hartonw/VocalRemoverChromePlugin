window.addEventListener("message", (event) => {
    // console.log("background received")
    // send the vocal removed sounds from sandbox back to service_worker(because background.js cannot send direct message to content script)
    chrome.runtime.sendMessage({ type: "processedSounds", payload: event.data });
});


chrome.runtime.onMessage.addListener((message) => {
    if (message.type == "preProcessedSound") {
        // send message to sandbox.
        console.log("sending message to sandbox")
        document.getElementById("sandbox").contentWindow.postMessage({ type: "preProcessedSound", payload: message.payload }, "*");
    } else if (message.type == "stop") {
        location.reload();
    }
});