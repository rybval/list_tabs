var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");

var button = buttons.ActionButton({
  id: "list-tabs",
  label: "List tabs",
  icon: {
    "32": "./icon-32.png"
  },
  onClick: handleClick
});

function handleClick(state) {
    tabs.open({
        url: "./page.html",
        onReady: function(tab) {
            var worker = tab.attach({
                contentScriptFile: './buildpage.js'
            });
            tabs_list = [];
            for (tab of tabs) {
                tabs_list.push({
                    title: tab.title,
                    url: tab.url,
                    index: tab.index
                });
            }
            worker.port.emit("tabs", tabs_list);
        }
    });
}