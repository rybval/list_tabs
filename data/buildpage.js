self.port.on("tabs", function(message) {
    var table = document.createElement("table");
    for (let tab of message) {
        createRow(table, tab.title, tab.url, tab.index);
    }
    document.body.appendChild(table);
});

function createRow(table, title, url, index) {
    var row = table.insertRow(-1);
    var cell = row.insertCell(0);
    nbutton = document.createElement("button");
    nbutton.textContent = "" + index;
    nbutton.onclick = handleSwitchToButtonClick;
    cell.appendChild(nbutton);
    cell = row.insertCell(1);
    cell.appendChild(createTitle(title));
    cell.appendChild(createURL(url));
}

function handleSwitchToButtonClick() {
    self.port.emit("switch-to", parseInt(this.textContent));
}

function createTitle(title) {
    var b = document.createElement("b");
    b.textContent = title;
    var p = document.createElement("p");
    p.appendChild(b);
    return p;
}

function createURL(url) {
    var a = document.createElement("a");
    a.text = decodeURI(url);
    a.href = url;
    return a;
}
