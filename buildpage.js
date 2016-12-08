var myPort = browser.runtime.connect();

myPort.onMessage.addListener(function(m) {
    document.body.textContent = "";
    for (let url of m.urls) {
        let p = document.createElement("p");
        p.textContent = url;
        document.body.appendChild(p);
    }
});