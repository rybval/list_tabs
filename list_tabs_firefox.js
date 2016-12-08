browser.browserAction.onClicked.addListener(function() {
    browser.tabs.create({active: true, url: "about:blank"}).then(function(current_tab) {
        var tabs_list = [];
        browser.tabs.query({currentWindow: true}).then(function(response_tabs) {
            tabs_list = response_tabs;
        });

        browser.tabs.query({currentWindow: true, active: true}).then(function(response_tabs) {
            let currenttab = response_tabs[0];
            browser.tabs.executeScript(currenttab.id, {file: "buildpage.js"});

            var url_list = [];
            for (let tab of tabs_list) {
                url_list.push(tab.url);
            }

            browser.tabs.sendMessage(currenttab.id, {urls: url_list});
        });
    });
});
