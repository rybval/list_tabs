var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var mod = require("sdk/page-mod");

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

tabs.on('open', function(tab){
  tab.on('ready', function(tab){
    if (tab.url == self.data.url("page.html")) {
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
});
