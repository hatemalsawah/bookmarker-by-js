

let bookmarks = [];
let inputs = document.querySelectorAll('input');
let alerts = document.querySelectorAll("p.alert");
let btnsdelete = [];
let drawn = [];

function load() {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    if (bookmarks != null)
        displayData();
    else bookmarks = [];
    updateDeleteButtons();
    addDeleteEvent();
    hideAlerts();
}
window.onload = load;

function hideAlerts() {
    for (let i = 0; i < alerts.length; i++)
        alerts[i].style.display = "none";
}

function clearForm() {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
}

function isDrawn(bookmark) {
    for (let i = 0; i < drawn.length; i++)
        if (bookmark == drawn[i])
            return true;
    return false;
}

function displayData() {
    for (let i = 0; i < bookmarks.length; i++) {
        if (!isDrawn(bookmarks[i]))
            createWell(bookmarks[i]);
    }
}

function createWell(bookmark) {
    let div = document.getElementById('bookmarkList');
    div.innerHTML += "<div class=\"webwell row\" id=\"" + bookmark.name + "\"></div> "; 
    let link = "<a class=\"btn btn-primary\" href=\"" + bookmark.url + "\" target=\"_blank\">visit</a>"; 
    let btndelete = "<button class=\"btn btn-danger btndelete\">Delete</button>"; 
    let h4 = "<h2>" + bookmark.name + "</h2>"; 
    let webwell = document.getElementById(bookmark.name); 
    webwell.innerHTML = h4 + link + btndelete; 
    drawn.push(bookmark);
}

function deleteWell(bookmark) {
    drawn.splice(drawn.indexOf(bookmark), 1);
    let div = document.getElementById('bookmarkList'); 	
    let webwell = document.getElementById(bookmark.name); 
    let k = "<div class=\"webwell row\" id=\"" + bookmark.name + "\">" + webwell.innerHTML + "</div>";
    div.innerHTML = div.innerHTML.replace(k, "");
    updateDeleteButtons();
    addDeleteEvent();
}

function submit() {
    let siteName = document.querySelector("#siteName").value;
    let siteUrl = document.querySelector("#siteUrl").value;

    if (checkName(siteName) && checkUrl(siteUrl)) {
        hideAlerts();
        siteUrl = addHttp(siteUrl);
        let bookmark = { name: siteName, url: siteUrl };
        bookmarks.push(bookmark);
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        displayData();
        updateDeleteButtons();
        addDeleteEvent();
        clearForm();
    } else {
        if (!checkName(siteName)) {
            showNameError("this name already exist");
        }
        if (!checkUrl(siteUrl)) {
            showNameError("this url already exist");
        }
        if (siteName == null || siteName == "") {
            showNameError("Name is required");
        }
        if (siteUrl == null || siteUrl == "") {
            showUrlError("Url Field is required");
        }
    }
}

function checkName(name) {
    if (name == null || name == "") {
        return false;
    }
    for (let i = 0; i < bookmarks.length; i++) {
        if (bookmarks[i].name === name)
            return false;
    }
    return true;
}

function checkUrl(url) {
    if (url == null || url == "") {
        return false;
    }
    for (let i = 0; i < bookmarks.length; i++) {
        if (bookmarks[i].url === url)
            return false;
    }
    return true;
}

function showNameError(msg) {
    let nameError = document.getElementById('nameError');
    nameError.innerHTML = msg;
    nameError.style.display = 'block';
}

function showUrlError(msg) {
    let urlError = document.getElementById('urlError');
    urlError.innerHTML = msg;
    urlError.style.display = 'block';

}

function updateDeleteButtons() {
    btnsdelete = document.querySelectorAll(".btndelete");
}

function addDeleteEvent() {
    for (let i = 0; i < btnsdelete.length; i++) {
        btnsdelete[i].addEventListener("click", function(e) {
            console.log(e);
            let item = e.target.parentElement;
            for (let i = 0; i < bookmarks.length; i++) {
                if (item.id == bookmarks[i].name) {
                    deleteWell(bookmarks[i]);
                    bookmarks.splice(i, 1);
                    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

                }
            }
        })
    }
}

function addHttp(url) {
    if (url.search("http://") == -1 && url.search("https://") == -1)
        return "http://" + url;
    return url;
}
document.addEventListener("keypress", function(e) {
    console.log(e);
    if (e.keyCode == 13)
        submit();
})