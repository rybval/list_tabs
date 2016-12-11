self.port.on("tabs", function(tabs) {
    var table = document.createElement("table");
    let row = table.insertRow(0);

    var table_headers = ["#", "id", "Title & URL", "Close"];

    for (let i = 0; i < table_headers.length; i++) {
        let cell = row.insertCell(-1);
        let b = document.createElement("b");
        b.textContent = table_headers[i];
        cell.appendChild(b);
    }

    for (let i = 0; i < tabs.length; i++) {
        let tab = tabs[i];
        createRow(table, tab.title, tab.url, i, tab.id);
    }
    document.body.appendChild(table);
});

function createRow(table, title, url, index, id) {
    var row = table.insertRow(-1);

    cell = row.insertCell(-1);
    cell.appendChild(createActivateButton(index, id));

    cell = row.insertCell(-1);
    cell.textContent = "" + id;

    cell = row.insertCell(-1);
    cell.appendChild(createTitle(title));
    cell.appendChild(createURL(url));

    cell = row.insertCell(-1);
    cell.appendChild(createCloseButton(id));
}

function onActivateButtonAction() {
    self.port.emit("activate", this.name);
}

function onCloseButtonAction() {
    self.port.emit("close", this.name);
    this.textContent = "Closed";
}

function createButton(name, text, handler) {
    var button = document.createElement("button");
    button.name = name;
    button.textContent = text;
    button.onclick = handler;
    return button;
}

function createActivateButton(index, id) {
    return createButton("" + id,
                        "" + index,
                        onActivateButtonAction);
}

function createCloseButton(id) {
    return createButton("" + id,
                        "X",
                        onCloseButtonAction);
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
