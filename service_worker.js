chrome.offscreen.createDocument({
    url: chrome.runtime.getURL('offscreen.html'),
    reasons: ['IFRAME_SCRIPTING'],
    justification: 'Use WebGPU needs document API',
});


let currentTab = -1;

async function startRequestLoop(tabId) {
    // Prevent processing the same tab multiple times
    if (tabId == currentTab) {
        return;
    }
    // Set the current tab to the provided tabId
    currentTab = tabId;

    while (true) {
        // Create a promise to wait for a response
        const responsePromise = new Promise(resolve => {
            chrome.tabs.sendMessage(tabId, { type: "request", payload: null }, resolve);
        });
        // Check if the tab is still the current tab
        if (currentTab != tabId) {
            return;
        }
        // Wait for the response
        let result = await responsePromise;

        // Process the response if it's not null
        if (result != null) {
            chrome.runtime.sendMessage({ type: "inputBuffer", payload: [result[0], result[1]] });
        }
    }
}

chrome.runtime.onMessage.addListener((message) => {
    // Received when user click execute and content script is done with the set up
    if (message.type == "tabId") {
        // if the current tab change to a new active tab
        if (currentTab != -1 && message.payload != currentTab) {
            // the payload here is current active tab id
            chrome.tabs.sendMessage(currentTab, { type: "stop", payload: message.payload });
        }
        startRequestLoop(message.payload);
    } else if (message.type == "outputBuffer") {
        // Sending to content script for the 
        chrome.tabs.sendMessage(currentTab, { type: "buffer", payload: message.payload });
    } else if (message.type == "stop") {
        chrome.tabs.sendMessage(currentTab, { type: "stop", payload: message.payload });
        currentTab = -1;
    }
});