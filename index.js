let isStopped = false;
let currentTab;
document.querySelector("#execute").addEventListener("click", () => {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Ask content script to set up audio node
        currentTab = tabs[0].id
        chrome.tabs.sendMessage(currentTab, { type: "start", payload: currentTab });
    });
});


document.querySelector("#stop").addEventListener("click", () => {
    if (!isStopped) {
        chrome.runtime.sendMessage({ type: "stop", payload: null });
        // chrome.tabs.sendMessage(currentTab, { type: "stop", payload: currentTab });
        isStopped = true;
    }
});