window.addEventListener("message", (event) => {
    // console.log("background received")
    // send the vocal removed sounds from sandbox back to service_worker(because background.js cannot send direct message to content script)
    chrome.runtime.sendMessage({ type: "outputBuffer", payload: event.data });
});


chrome.runtime.onMessage.addListener((message) => {
    if (message.type == "inputBuffer") {
        // send message to sandbox.
        console.log("sending message to sandbox")
        document.getElementById("sandbox").contentWindow.postMessage({ type: "buffer", payload: [message.payload[0], message.payload[1]] }, "*");
    } else if (message.type == "stop") {
        location.reload();
    }
});