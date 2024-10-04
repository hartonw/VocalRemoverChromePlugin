let currentTab;
window.addEventListener("message", (event) => {
    // send the vocal removed sounds from sandbox back to content script
    // chrome.tabs.sendMessage(tabs[0].id, { type: "outputBuffer", payload: event.data });
    // chrome.runtime.sendMessage(tabs[0].id, { type: "outputBuffer", payload: event.data });

});


chrome.runtime.onMessage.addListener((message) => {
    if (message.type == "tab") {
        currentTab = message.payload
    }
    if (message.type == "inputBuffer") {
        // send message to sandbox.
        document.getElementById("sandbox").contentWindow.postMessage({ type: "buffer", payload: [message.payload[0], message.payload[1]] }, "*");
    } else if (message.type == "stop") {
        location.reload();
    }
});