var myPort = browser.runtime.connect();

myPort.onMessage.addListener(function(m) {
    document.body.textContent = "";
    var table = document.createElement("table");
    for (let tab of m.tabs) {
        createRow(table, tab.title, tab.url, tab.index);
    }
    document.body.appendChild(table);
});

function createRow(table, title, url, index) {
    var row = table.insertRow(-1);
    var cell = row.insertCell(0);
    p = document.createElement("p");
    p.textContent = "" + index;
    cell.appendChild(p);
    cell = row.insertCell(1);
    cell.appendChild(createTitle(title));
    cell.appendChild(createURL(url));
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
