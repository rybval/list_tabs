let tabs_cache;
let fileWithURLs = null;

function createFile(tabs) {
  text = "";
  for (let tab of tabs) {
    text += tab.url + '\n';
  }

  var data = new Blob([text], {type: 'text/plain'});

  if (fileWithURLs !== null) {
    window.URL.revokeObjectURL(fileWithURLs);
  }

  fileWithURLs = window.URL.createObjectURL(data);
};

function prepareTabs(tabs) {
  tabs_cache = tabs;

  if (document.getElementById("filter").value) {
    tabs = tabs.filter(tab => RegExp(document.getElementById("filter").value).exec(tab.url));
  }

  if (document.getElementById('sort').checked) {
    tabs.sort((tab1, tab2) => {
      if (tab1.url < tab2.url) {
        return -1;
      }
      if (tab1.url > tab2.url) {
        return 1;
      }
      return 0;
    });
  }

  buildTable(tabs);
  createFile(tabs);
  document.getElementById('save').href = fileWithURLs;
}

function update() {
  cleanTable();
  browser.tabs.query({currentWindow: true}).then(tabs => {
    prepareTabs(tabs);
  });
};

document.getElementById('update').onclick = update;

update();

function buildTable(tabs) {
  var table = document.getElementById("tabs_table");

  var table_headers = ["#", "X", "★", "", "Title & URL"];
  createHeaderRow(table, table_headers);

  var pinned_tabs = [];
  var not_pinned_tabs = [];
  for (let tab of tabs) {
    if (tab.pinned) {
      pinned_tabs.push(tab);
    } else {
      not_pinned_tabs.push(tab);
    }
  }

  if (pinned_tabs.length > 0) {
    createSeparatorRow(table, "Pinned:", table_headers.length);
    createBunchOfTabRows(table, pinned_tabs);
    createSeparatorRow(table, "Not pinned:", table_headers.length);
  }

  createBunchOfTabRows(table, not_pinned_tabs);

  document.body.appendChild(table);
}

function createHeaderRow(table, headers) {
  let row = table.insertRow(0);
  for (let i = 0; i < headers.length; i++) {
    let cell = row.insertCell(-1);
    cell.classList.add("header");
    cell.textContent = headers[i];
  }
}

function createSeparatorRow(table, text, cols) {
    let row = table.insertRow(-1);
    row.classList.add("separator");
    let cell = row.insertCell(-1);
    cell.classList.add("separator");
    cell.colSpan = cols;
    cell.textContent = text;
}

function createBunchOfTabRows(table, tabs) {
  for (let i = 0; i < tabs.length; i++) {
    let tab = tabs[i];
    createTabRow(table, tab.title, tab.url, i, tab.id, tab.favIconUrl);
  }
}

function createTabRow(table, title, url, index, id, favIconUrl) {
  var row = table.insertRow(-1);
  row.classList.add("tab");

  getNewTabCell(row).appendChild(createActivateButton(index, id));
  getNewTabCell(row).appendChild(createCloseButton(id));
  getNewTabCell(row).appendChild(createBookmarkButton(url));
  getNewTabCell(row).appendChild(createFavicon(favIconUrl));

  cell = getNewTabCell(row);
  cell.appendChild(createTitle(title));
  cell.appendChild(document.createElement("br"));
  cell.appendChild(createURL(url));
}

function getNewTabCell(row) {
  cell = row.insertCell(-1);
  cell.classList.add("tab");
  return cell;
}

function onActivateButtonAction() {
  browser.tabs.update(parseInt(this.name), {active: true});
}

function onCloseButtonAction() {
  browser.tabs.remove(parseInt(this.name)).then(() => {this.disabled = true});
}

function onBookmarkButtonAction() {
  browser.bookmarks.create({url: this.name}).then(() => {this.textContent = "★"});
}

function createButton(name, text, handler) {
  var button = document.createElement("button");
  button.name = name;
  button.textContent = text;
  button.onclick = handler;
  button.classList.add("cellButton");
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

function createBookmarkButton(url) {
  return createButton(url, '☆', onBookmarkButtonAction);
}

function createTitle(title) {
  return document.createTextNode(title);
}

function createURL(url) {
  var a = document.createElement("a");
  a.classList.add("tabURL");
  a.text = decodeURI(url);
  a.href = url;
  return a;
}

function createFavicon(url) {
  var img = document.createElement("img");
  img.src = url;
  img.height = 16;
  img.width = 16;
  return img;
}

function cleanTable() {
  var table = document.getElementById("tabs_table");
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}
