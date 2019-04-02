// Show page action icon in omnibar.
function ShowPageAction(tabId, changeInfo, tab) {
	chrome.pageAction.show(tabId);
}

// Chrome v.33+
chrome.runtime.onInstalled.addListener(function(details) {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [
				new chrome.declarativeContent.PageStateMatcher({
					pageUrl: {
						hostContains: 'youtube.com'
					}
				})
			],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(message);
    alert(message);

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status === 200) {
            alert("mame odpoved")
            prepareResults(this.responseText, id);
        }
    });

    xhr.open("POST", "https://videacesky.herokuapp.com/check", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(message);
    alert("poslano");

});
