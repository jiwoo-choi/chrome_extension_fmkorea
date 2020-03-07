import StorageController from './StorageController.js';

function broadcastUpdateMessage() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		 chrome.tabs.sendMessage(tabs[0].id, {text: ""});
	});
}

function findKeyword(target) {
	if(target.tagName === "LI") {
		return;
	} else if(target.className === "chip-container") {
		return target.firstElementChild.innerText;
	} else if(target.tagName === "SPAN") {
		return target.innerText;
	} else if(target.className === "chip-container-x"){
		return target.previousElementSibling.innerText;
	}
}

function updateChip(keywordList) {
	const chipUl = document.querySelector(".chip-list");
    const templateChip = document.getElementById("chip").innerHTML;

    chipUl.innerHTML = keywordList.reduce((prev, keyword) => {
    	prev += templateChip.replace("{{keyword}}", keyword);
    	return prev;
    }, "");	
}

async function viewDidLoad(){
	const storageController = new StorageController("keyword");
	const sendButton = document.querySelector(".button-element");
	const input = document.querySelector("#textArea");
	const chipUl = document.querySelector(".chip-list");
	let savedKeyword = await storageController.getKeywordList();

	updateChip(savedKeyword);

	chipUl.addEventListener("click", async function(event) {
		const target = event.target;
		let keyword = findKeyword(target);
		if(keyword == null) return;

		await storageController.removeKeyword(keyword);
		savedKeyword = await storageController.getKeywordList();
		updateChip(savedKeyword);
		broadcastUpdateMessage();
	});

	sendButton.addEventListener("click", async function() {
		await storageController.saveKeywordFor(input.value)
		savedKeyword = await storageController.getKeywordList();
		updateChip(savedKeyword);
		broadcastUpdateMessage() ;
		input.value = "";
	})
}



document.addEventListener("DOMContentLoaded", function() {
	viewDidLoad();
});
