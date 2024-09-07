let isStopped = false;
document.querySelector("#execute").addEventListener("click", () => {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Ask content script to set up audio node
        chrome.tabs.sendMessage(tabs[0].id, { type: "start", payload: tabs[0].id });
    });
});


document.querySelector("#stop").addEventListener("click", () => {
    if (!isStopped) chrome.runtime.sendMessage({ type: "stop", payload: null });
});