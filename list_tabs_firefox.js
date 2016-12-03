function forTab(tabs) {
    var urls_list = []
    for (var tab of tabs) {
        urls_list.push(tab.url)
    }
}
    

function showTabsList() {
    browser.tabs.query({"currentWindow": "True"},  forTab);
    
}


chrome.browserAction.onClicked.addListener(showTabsList);