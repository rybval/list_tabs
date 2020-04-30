let tabs_cache;
let star = "\u2606";
let cross = "\u2A2F";

browser.tabs.query({currentWindow: true}).then(tabs => {
  tabs_cache = tabs;
  let download_link = document.getElementById('download_json');
  let serialized_tabs = JSON.stringify(tabs, ["title", "url"], 2);
  download_link.setAttribute(
    'href',
    'data:application/json;charset=utf-8,' + encodeURIComponent(serialized_tabs)
  );
  download_link.setAttribute(
    'download',
    `list_tabs_${(new Date()).toISOString()}.json`
  );

  createTable(tabs);
});

document.getElementById('close_duplicates').onclick = closeDuplicates;

function createTable(tabs) {
  var table = document.createElement("table");

  var table_headers = ["#", star, cross, "", "Title & URL"];
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
  getNewTabCell(row).appendChild(createBookmarkButton(id));
  getNewTabCell(row).appendChild(createCloseButton(id));
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

function onBookmarkButtonAction() {
  browser.tabs.get(
    parseInt(this.name),
    (tab) => {
      browser.bookmarks.create({
        title: tab.title,
        url: tab.url
      }).then(
        () => {this.disabled = true}
      );
    }
  );
}

function onCloseButtonAction() {
  browser.tabs.remove(parseInt(this.name)).then(() => {this.disabled = true});
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
  return createButton("" + id, "" + index, onActivateButtonAction);
}

function createBookmarkButton(id) {
  return createButton("" + id, star, onBookmarkButtonAction);
}

function createCloseButton(id) {
  return createButton("" + id, cross, onCloseButtonAction);
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

function closeDuplicates() {
  let urls = new Set();
  for (let tab of tabs_cache) {
    if (urls.has(tab.url)) {
      browser.tabs.remove(tab.id);
    } else {
      urls.add(tab.url);
    }
  }
  document.location.reload(true);
}
