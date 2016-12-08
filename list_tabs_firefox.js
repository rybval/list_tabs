var portFromCS;

browser.browserAction.onClicked.addListener(function() {
    browser.tabs.create({active: true, url: "/blank.html"}).then(onCreated);
});

function onCreated(tab) {
  browser.runtime.onConnect.addListener(connected);
}

function onReceivedTabs(tabs) {
    var url_list = [];
    var activeTabId;
    for (let tab of tabs) {
        url_list.push(tab.url);
        if (tab.active == true) {
            activeTabId = tab.id;
        }
    }
   portFromCS.postMessage({urls: url_list});
}

function connected(p) {
  portFromCS = p;
  browser.tabs.query({currentWindow: true}).then(onReceivedTabs);
}

browser.runtime.onConnect.addListener(connected);