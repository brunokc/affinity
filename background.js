chrome.runtime.onInstalled.addListener(function() {
  log("Affinity loaded.");
});

chrome.windows.onCreated.addListener(function(win) {
  log("New window: ", win);
});

chrome.tabs.onCreated.addListener(function(tab) {
  log("New tab: id=" + tab.id + "; index=" + tab.index + "; windowId=" + tab.windowId + "; url=" + 
    tab.url + "; tab:", tab);
  positionTab(tab);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  log("Updated tab: id=" + tabId + "; changeInfo:", changeInfo);

  if (changeInfo.url) {
    // URL changed (redirect?), apply our logic again
    positionTab(tab);
  }
});
