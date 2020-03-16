(async() => {
	const src = chrome.extension.getURL('contentMain.js');
	const contentScript = await import(src);
	contentScript.contentMain();
})();

//            // "scripts": ["background.js","./Redux/store.js"],
            //"scripts": ["./Redux/store.js"],
