// Detect the presence of Clacks Overhead in an HTTP response
// from the X-Clacks-Overhead and Clacks-Overhead headers.
var clacks = {
  findHeader: function(obj, idx, arr) {
    return (this.indexOf(obj.name) >= 0);
  },

  responseCallback: function(details) {
    matchingHeaders = details.responseHeaders.filter(clacks.findHeader, ['X-Clacks-Overhead', 'Clacks-Overhead']);
    clacks.tabs[details.tabId] = matchingHeaders;
  },

  clacksForTab: function(tabId) {
    matchingHeaders = clacks.tabs[tabId];
    return matchingHeaders ? matchingHeaders : [];
  },

  changeTabCallback: function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
      tabId = tab[0].id;
      matchingHeaders = clacks.clacksForTab(tabId);

      if (matchingHeaders.length > 0) {

        // Headers found
        chrome.browserAction.setBadgeText({
          text: matchingHeaders.length.toString()
        });

        chrome.browserAction.setIcon({
          path: 'icon_on.gif',
        });

      } else {

        // Headers not found
        chrome.browserAction.setBadgeText({text: ''});

        chrome.browserAction.setIcon({
          path: 'icon_off.gif',
        });

      }

    });
  },

  messageCallback: function(request, sender, sendResponse) {
    sendResponse({
      headers: clacks.clacksForTab(request)
    });
  },

  tabs: Array(),

  callbackFilter: {
    urls: ["<all_urls>"],
    types: ["main_frame"],
  },

  main: function() {
    chrome.webRequest.onHeadersReceived.addListener(clacks.responseCallback, clacks.callbackFilter, ['responseHeaders']);
    chrome.tabs.onActivated.addListener(clacks.changeTabCallback);
    chrome.tabs.onUpdated.addListener(clacks.changeTabCallback);
    chrome.runtime.onMessage.addListener(clacks.messageCallback);
  }
};

clacks.main();
