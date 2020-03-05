import StorageController from './StorageController.js';

function removeTitles(keywordList) {

	const titleTag = document.querySelectorAll("h3.title");

	for(let element of titleTag) {
		for(const keyword of keywordList) {
			console.log(element.offsetParent)
			if(element.innerText.includes(keyword)) {
				//element.offsetParent.innerHTML = ""
				//element.offsetParent.style.backgroundColor= "black"
				if (element.offsetParent !== null) {
					element.offsetParent.style.display = "none"
				}
			}
		}
	}
}



export function contentMain() { 
	const storageController =  new StorageController("keyword");
	async function filterTitle() {
		storageController.getKeywordList()
			.then(keywordList => { 
				removeTitles(keywordList)
			})
		//.catch(reason => {}) //alert(reason);})
	}

	filterTitle();
		

	chrome.runtime.onMessage.addListener(
		async function(request, sender, sendResponse) {
			alert('hey');
			await filterTitle();
	});


}


