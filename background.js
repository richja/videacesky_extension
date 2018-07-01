// Show page action icon in omnibar.
function ShowPageAction(tabId, changeInfo, tab) {
	chrome.pageAction.show(tabId);
}

// chrome.declarativeContent API not yet implemented in Firefox
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (changeInfo.url && changeInfo.status==='complete' && tab.url.match(/youtube.com/)) {
		chrome.pageAction.show(tabId);
	} else {
		chrome.pageAction.hide(tabId);
	}
});

