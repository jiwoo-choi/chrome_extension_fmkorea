async function updateKeywords() {
	return new Promise(function(resolve){
			chrome.storage.sync.get(['keyword'], function(result) {
				let currentKeywords;
				currentKeywords = result.keyword
				currentKeywords = (currentKeywords == undefined) ? [] : currentKeywords; // avoid undefined case.
				resolve(currentKeywords);
			});		
	})
}

async function removeTitles(keywordList) {
	const titleTag = document.querySelectorAll("h3.title");
	for(let element of titleTag) {
		for(const keyword of keywordList) {
			if(element.innerText.includes(keyword)) {
				element.offsetParent.style.display = "none";
			}
		}
	}
}

chrome.runtime.onMessage.addListener(
	async function(request, sender, sendResponse) {
		const keywordList = await updateKeywords();
		await removeTitles(keywordList);
});


 async function viewDidLoad(){
 	const keywordList = await updateKeywords();
	await removeTitles(keywordList);
}
viewDidLoad();

//viewDidLoad();
