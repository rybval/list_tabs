browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    document.body.textContent = "";
    for (let url of request.urls) {
        let p = document.createElement("p");
        p.textContent = url;
        document.body.appendChild(p);
    }
});
