let currentTab;

chrome.offscreen.createDocument({
    url: chrome.runtime.getURL('offscreen.html'),
    reasons: ['IFRAME_SCRIPTING'],
    justification: 'Use WebGPU needs document API',
});


chrome.runtime.onMessage.addListener((message) => {
    if (message.type == "tab") {
        currentTab = message.payload
    }
    if (message.type == "processedSounds") {
        chrome.tabs.sendMessage(currentTab, { type: "outputBuffer", payload: message.payload })
    }
    if (message.type == "stop") {
        chrome.tabs.sendMessage(currentTab, { type: "stop", payload: message.payload });
        currentTab = -1;
    }
});