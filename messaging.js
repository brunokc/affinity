var extensionId = "cojiampjnphpljoaheknkcgobcfhceho";

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    console.log("port.onMessage: " + msg);
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("runtime::onMessage: " + request);
});

// External 
chrome.runtime.onConnectExternal.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    console.log("[external] port.onMessage: " + msg);
  });
});

chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
  console.log("[external] runtime::onMessageExternal: " + request);
  // switch (request.command) {
  //   case "queryTabs":

  // }
});

// var port = chrome.runtime.connect(extensionId);
