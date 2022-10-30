let subButton;

//to fire new request when going back/forward in history
window.addEventListener("popstate", function (event) {
    getVideoId(document.location.search);
});

const observer = new MutationObserver(function (mutations, me) {
    subButton = document.getElementById("bottom-row");

    if (subButton) {
        getVideoId(document.location.search);
        me.disconnect();

        window.addEventListener("yt-navigate-finish", function (event) {
            getVideoId(document.location.search);
        });

        return;
    }
    console.error("VC extension: subscribe button not found")
});

observer.observe(document, {
    childList: true,
    subtree: true
});

/**
 * Parse URL and fetch YouTube video ID
 *
 * @param queryString query string of URL
 */
function getVideoId(queryString) {
    const searchQueryRaw = queryString.substring(1);
    const searchQuery = searchQueryRaw.split('&');

    for (let i = 0; i < searchQuery.length; i++) {
        const tokens = searchQuery[i].split('=');
        const param = tokens[0].toLowerCase();
        if (param === "v") {
            searchVideo(tokens[1]);
            break;
        }
    }
}

/**
 * Send a request to API to search video
 *
 * @param id YouTube video ID
 */
function searchVideo(id) {
    const data = "url=" + id;

    const xhr = new XMLHttpRequest();

    console.log("sending request", id);

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            prepareResults(this.responseText, id);
        }
    });

    xhr.open("POST", "https://videacesky.herokuapp.com/check", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
}

/**
 * Handle response of an API and prepare results
 *
 * @param response XMLHttpRequest response object with results of API request
 * @param id YouTube video ID
 */
function prepareResults(response, id) {
    const result = JSON.parse(response);
    const divObj = {};

    divObj.subButton = subButton;
    divObj.parent = subButton.parentElement;

    if (document.getElementById("ext-videacesky-id")) {
        divObj.vcDiv = document.getElementById("ext-videacesky-id");
    }
    else {
        divObj.vcDiv = document.createElement("div");
        divObj.vcDiv.className = "ext-videacesky-wrapper";
        divObj.vcDiv.id = "ext-videacesky-id";
    }

    const isNewLook = document.getElementsByClassName("yt-spec-touch-feedback-shape").length;
    const hrefClass = isNewLook ? "ext-videacesky-href ext-videacesky-new-look" : "ext-videacesky-href";

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
        chrome.storage.sync.get("defaultEmail", function (data) {
            const query = typeof data.defaultEmail === "string" ? id + "&tip_video_email=" + data.defaultEmail : id;
            divObj.divContent = "<a href='https://videacesky.cz/pridat-tip/?tip_video_url=https://youtu.be/" + query + "' class='" + hrefClass + " ext-videacesky-nope' target='_blank'>Navrhnout na překlad?</a>";

            renderResults(divObj);
        });
    }
}

/**
 * 
 * @param divObj object with elemenet details to render 
 */
function renderResults(divObj) {
    divObj.vcDiv.innerHTML = divObj.divContent;
    divObj.parent.insertBefore(divObj.vcDiv, divObj.subButton);
}
