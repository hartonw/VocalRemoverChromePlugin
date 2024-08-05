document.querySelector("#execute").addEventListener("click", () => {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Ask content script to set up audio node
        chrome.tabs.sendMessage(tabs[0].id, { type: "start", payload: null }, (responseFromContent) => {
            // When content script is done with the set up
            if (responseFromContent == "ok") {
                // Ask service worker to start an infinite loop on sending request to sandbox for Tensor flow model run. 
                chrome.runtime.sendMessage({ type: "tabId", payload: tabs[0].id });
            }
        });
    });
});


document.querySelector("#stop").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "stop", payload: null });
});