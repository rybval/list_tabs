var myPort = browser.runtime.connect();

myPort.onMessage.addListener(function(m) {
    document.body.textContent = "";
    var table = document.createElement("table");
    for (let tab of m.tabs) {
        createRow(table, tab.title, tab.url);
    }
    document.body.appendChild(table);
});

function createRow(table, title, url) {
    var row = table.insertRow(-1);
    row.appendChild(createTitle(title));
    row.appendChild(createURL(url));
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
    a.text = url;
    a.href = url;
    return a;
}
