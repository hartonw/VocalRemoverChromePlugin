window.addEventListener("message", (event) => {
    let buffer = event.data;
    chrome.runtime.sendMessage({ type: "outputBuffer", payload: buffer });
});


chrome.runtime.onMessage.addListener((message) => {
    if (message.type == "inputBuffer") {
        // send message to sandbox.
        console.log(message.type);
        document.getElementById("sandbox").contentWindow.postMessage({ type: "buffer", payload: [message.payload[0], message.payload[1]] }, "*");
    } else if (message.type == "stop") {
        location.reload();
    }
});