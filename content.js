var isNewYoutube = !document.getElementById("yt-masthead");

//for new material YouTube
if (isNewYoutube) {
    window.addEventListener("yt-navigate-finish", function(event) {
        getVideoId(document.location.search);
    });
}
//for old style YouTube
else {
    getVideoId(document.location.search);

    window.addEventListener("spfdone", function(event) {
        getVideoId(document.location.search);
    });
}

/**
 * Parse URL and fetch YouTube video ID
 *
 * @param queryString query string of URL
 */
function getVideoId(queryString) {
    var searchQueryRaw = queryString.substring(1);
    var searchQuery = searchQueryRaw.split('&');

    for (var i = 0; i < searchQuery.length; i++) {
        var tokens = searchQuery[i].split('=');
        var param = tokens[0].toLowerCase();
        if (param === "v") {
            searchVideo(tokens[1]);
        }
    }
}

/**
 * Send a request to API to search video
 *
 * @param id YouTube video ID
 */
function searchVideo(id) {
    var data = "url=" + id;

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            prepareResults(this.responseText, id);
        }
    });

    xhr.open("POST", "https://videacesky.herokuapp.com/check", true);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.send(data);
}

/**
 * Handle response of an API and prepare results
 *
 * @param response XMLHttpRequest response object with results of API request
 * @param id YouTube video ID
 */
function prepareResults(response, id) {
    var result = JSON.parse(response);
    var divObj = {};

    if (isNewYoutube) {
        divObj.subButton = document.getElementsByTagName("ytd-video-owner-renderer")[0].nextSibling;
        divObj.parent = document.getElementById("top-row");
    }
    else {
        divObj.subButton = document.getElementById("yt-uix-button-subscription-container");
        divObj.parent = document.getElementById("watch7-user-header");
    }

    if (document.getElementById("ext-videacesky-id")) {
        divObj.vcDiv = document.getElementById("ext-videacesky-id");
    }
    else {
        divObj.vcDiv = document.createElement("div");
        divObj.vcDiv.className = isNewYoutube ? "ext-videacesky-wrapper" : "ext-videacesky-wrapper-old";
        divObj.vcDiv.id = "ext-videacesky-id";
    }

    var hrefClass = isNewYoutube ? "ext-videacesky-href" : "ext-videacesky-href ext-videacesky-href-old";

    if (result.status) {
        if (result.published) {
            divObj.divContent = "<a href='" + result.url + "' class='" + hrefClass + " ext-videacesky-success'>Přehrát na videacesky.cz</a>";
        }
        else {
            divObj.divContent = "<a href='https://videacesky.cz' target='_blank' class='" + hrefClass + " ext-videacesky-success'>Již brzy na videacesky.cz</a>";
        }

        renderResults(divObj);
    }
    else {
        chrome.storage.sync.get("defaultEmail", function(data) {
            var query = typeof data.defaultEmail === "string" ? id + "&entry.1991203886=" + data.defaultEmail : id;
            divObj.divContent = "<a href='https://docs.google.com/forms/d/e/1FAIpQLSf7LhmXpCijd-3DjKtdSPwKsSk9U4Q0NcIfHnETcuYjil9t9g/viewform?entry.979401215=https://youtu.be/" + query + "' class='" + hrefClass + " ext-videacesky-nope' target='_blank'>Navrhnout na překlad?</a>";
    
            renderResults(divObj);
        });
    }
}

function renderResults(divObj) {
    divObj.vcDiv.innerHTML = divObj.divContent;
    divObj.parent.insertBefore(divObj.vcDiv, divObj.subButton);
}