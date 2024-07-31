window.addEventListener("message", (event) => {
    let buffer = event.data;
    chrome.runtime.sendMessage({ type: "outputBuffer", payload: buffer });
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type == "inputBuffer") {
        document.getElementById("sandbox").contentWindow.postMessage({ type: "buffer", payload: [message.payload[0], message.payload[1]] }, "*");
    } else if (message.type == "stop") {
        location.reload();
    }
});