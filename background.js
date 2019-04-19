chrome.runtime.onInstalled.addListener(function() {
  log("Affinity loaded.");
});

chrome.tabs.onCreated.addListener(function(tab) {
  log("New tab: id=" + tab.id + "; index=" + tab.index + "; windowId=" + tab.windowId + "; url=" + tab.url);
  positionTab(tab);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // log("Updated tab: id=" + tabId + "; index=" + tab.index + "; windowId=" + tab.windowId + 
  //   "; status=" + changeInfo.status + "; url=" + changeInfo.url);
  log("Updated tab: id=" + tabId + "; changeInfo=", changeInfo);

  if (changeInfo.url) {
    // URL changed (redirect?), apply our logic again
    positionTab(tab);
  }
});
