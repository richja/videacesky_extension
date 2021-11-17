// Show action icon in omnibar.
function ShowAction(tabId, changeInfo, tab) {
	chrome.action.show(tabId);
}

// Manifest V3
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
			actions: [new chrome.declarativeContent.ShowAction()]
		}]);
	});
});
