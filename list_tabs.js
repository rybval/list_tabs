var portFromCS;

browser.browserAction.onClicked.addListener(function() {
    browser.tabs.create({active: true, url: "/page.html"}).then(onCreated);
});

function onCreated(tab) {
  browser.runtime.onConnect.addListener(connected);
}

function onReceivedTabs(tabs) {
    var activeTabId;
    for (let tab of tabs) {
        if (tab.active == true) {
            activeTabId = tab.id;
        }
    }
   portFromCS.postMessage({tabs: tabs});
}

function connected(p) {
  portFromCS = p;
  browser.tabs.query({currentWindow: true}).then(onReceivedTabs);
}

browser.runtime.onConnect.addListener(connected);
