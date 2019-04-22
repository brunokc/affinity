
function createUrl(urlString) {
  var url = null;
  try {
    url = new URL(urlString);
  }
  catch(e) {
    url = null;
  }
  
  return url;
}

function generateProtocolMatches(domain, addStarPrefix) {
  if (addStarPrefix) {
    return ["http://*." + domain + "/*", "https://*." + domain + "/*"];
  }
  else {
    return ["http://" + domain + "/*", "https://" + domain + "/*"];
  }
}

function generateMatchDomain(urlString) {
  var domains = [];
  var url = createUrl(urlString);
  if (url === null) {
    return [];
  }
  
  // Add domain itself
  domains = domains.concat(generateProtocolMatches(url.hostname, false));
  
  // Add second level domain
  var domainParts = url.hostname.split('.');
  if (domainParts.length > 2) {
    domainParts = domainParts.slice(domainParts.length - 2);
    domains = domains.concat(generateProtocolMatches(domainParts.join("."), true));
  }
  
  return domains;
}

function positionTab(tab) {
  var url = createUrl(tab.url);
  if (url == null || (url.protocol !== "http:" && url.protocol !== "https:")) {
    return;
  }
  
  // We assume the window ID from the new tab represents the current window ID
  var currentWindowId = tab.windowId;
  log("Current windowId=" + currentWindowId);
  
  var matchDomains = generateMatchDomain(tab.url);
  log("matchDomains = " + matchDomains);
  let q = { 
    url: matchDomains, 
    windowType: "normal" 
  };
  
  chrome.tabs.query(q, function(tabs) {
    var useCurrentWindow = false;
    var targetTab = null;
    var targetTabInCurrentWindow = null;
    
    for (var i = 0; i < tabs.length && tabs[i].id != tab.id; ++i) {
      log("considering tab id=" + tabs[i].id + "; index=" + tabs[i].index + "; windowId=" + 
        tabs[i].windowId + "; url=" + tabs[i].url);
      
      // Prefer tabs in the current window
      if (tabs[i].windowId === currentWindowId) {
        useCurrentWindow = true;
        if (targetTabInCurrentWindow === null || targetTabInCurrentWindow.index < tabs[i].index) {
          targetTabInCurrentWindow = tabs[i];
        }
      }
      else if (targetTab === null || targetTab.index < tabs[i].index) {
        targetTab = tabs[i];
      }
    }
    
    if (useCurrentWindow) {
      log("Preferring current window");
      targetTab = targetTabInCurrentWindow;
    }
    
    if (targetTab != null) {
      log("Positioning new tab at windowId=" + targetTab.windowId + "; index=" + (targetTab.index + 1));
      chrome.tabs.move(tab.id, { windowId: targetTab.windowId, index: targetTab.index + 1 }, function(tab) {
        // Highlight tab once the move completes
        chrome.windows.update(targetTab.windowId, { focused: true });
        chrome.tabs.highlight({ tabs: tab.index });
      });
    }
  });
}
