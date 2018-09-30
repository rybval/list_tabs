browser.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({active: true, url: "page.html"});
});
