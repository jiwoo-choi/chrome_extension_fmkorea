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

export async function contentMain() { 

	const storageController = new StorageController("keyword");
	const keywordList = await storageController.getKeywordList();

	removeTitles(keywordList)

	storageController.subscribe((event) => {
		switch(event.status){
		case "SUCCESS":
			removeTitles(event.data);
			break;
		case "FAILRUE": 
			// alert(event.message); this should be silent.
			break;
		}
	})


	// chrome.runtime.onMessage.addListener(
	// 	async function(request, sender, sendResponse) {
	// 		console.log("ADFASDF");
	// 	}
	// )
	

	// filterTitle(keywordList);

	/*
	function filterTitle() {
		storageController.getKeywordList()
			.then(keywordList => { 
				removeTitles(keywordList)
			});
	}*/
	/*
	chrome.runtime.onMessage.addListener(
		async function(request, sender, sendResponse) {
			await filterTitle();
	});*/
}


