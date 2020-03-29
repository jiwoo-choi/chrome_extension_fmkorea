(async() => {
	const src = chrome.extension.getURL('contentMain.js');
	const contentScript = await import(src);
	contentScript.contentMain();
})();