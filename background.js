chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({}, tabs => {
    for (let tab of tabs) {
      injectScript(tab.id);
    }
  });
  updateBadge();
});

chrome.runtime.onStartup.addListener(() => {
  updateBadge();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    injectScript(tabId);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.updateBadge) updateBadge();
});

function injectScript(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["inject.js"]
  }).catch(err => {
    // Fail silently on restricted pages
  });
}

function updateBadge() {
  chrome.storage.local.get("spoofConfig", ({ spoofConfig }) => {
    if (!spoofConfig) {
      chrome.action.setBadgeText({ text: "OFF" });
      chrome.action.setBadgeBackgroundColor({ color: "gray" });
      return;
    }

    const requiredFields = [
      'gpuVendor', 'gpuRenderer', 'hardwareConcurrency', 'deviceMemory',
    ];

    const isComplete = requiredFields.every(
      key => spoofConfig[key] !== undefined && spoofConfig[key] !== ""
    );

    chrome.action.setBadgeText({ text: isComplete ? "ON" : "!" });
    chrome.action.setBadgeBackgroundColor({ color: isComplete ? "green" : "orange" });
  });
}
