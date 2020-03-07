import StorageController from './StorageController.js';

function removeTitles(keywordList) {
	const titleTag = document.querySelectorAll("h3.title");

	for(let element of titleTag) {
		for(const keyword of keywordList) {
			if(element.innerText.includes(keyword)) {
				if (element.offsetParent !== null) {
					element.offsetParent.style.display = "none";
				}
			}
		}
	}
}

export function contentMain() { 
	const storageController =  new StorageController("keyword");
	function filterTitle() {
		storageController.getKeywordList()
			.then(keywordList => { 
				removeTitles(keywordList)
			});
	}
	filterTitle();
		
	chrome.runtime.onMessage.addListener(
		async function(request, sender, sendResponse) {
			await filterTitle();
	});
}


