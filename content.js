(async() => {
	const src = chrome.extension.getURL('main.js');
	const contentScript = await import(src);
	contentScript.main();
})();