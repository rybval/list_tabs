var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var windows = require("sdk/windows").browserWindows;

var button = buttons.ActionButton({
  id: "list-tabs",
  label: "List tabs",
  icon: {
    "32": "./icon-32.png"
  },
  onClick: handleClick
});

function handleClick(state) {
    tabs.open("./page.html");
}

function getObjectFromTab(tab) {
    return {
        title: tab.title,
        url: tab.url,
        id: tab.id,
        index: tab.index,
        pinned: tab.isPinned
    };
}

tabs.on('open', function(tab) {
  tab.on('ready', function(tab) {
    if (tab.url == self.data.url("page.html")) {
        var worker = tab.attach({
            contentScriptFile: './buildpage.js'
        });

        current_window_tabs_list = [];
        for (let tab of windows.activeWindow.tabs) {
            current_window_tabs_list.push(getObjectFromTab(tab));
        }

        all_tabs_list = [];
        for (let tab of tabs) {
            all_tabs_list.push(getObjectFromTab(tab));
        }

        current_window_right_ordered_tabs_list = [];
        for (let tab of all_tabs_list) {
            if (current_window_tabs_list.some( w_tab => w_tab.id == tab.id )) {
                current_window_right_ordered_tabs_list.push(tab);
            }
        }

        worker.port.emit("tabs", current_window_right_ordered_tabs_list);
        worker.port.on("activate", activateTab);
        worker.port.on("close", closeTab);
    }
  });
});

function activateTab(id) {
    for (let tab of tabs) {
        if (tab.id == id) {
            tab.activate();
        }
    }
}

function closeTab(id) {
    for (let tab of tabs) {
        if (tab.id == id) {
            tab.close();
        }
    }
}
