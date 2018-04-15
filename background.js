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