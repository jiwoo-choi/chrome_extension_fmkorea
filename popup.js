import StorageController from './StorageController.js';

function broadcastUpdateMessage() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		 chrome.tabs.sendMessage(tabs[0].id, {text: ""});
	});
}

function getKeywordFromAction(target) {
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
	const chipTemplate = document.querySelector('#chip-template');

	chipUl.innerHTML = ""

	keywordList.forEach(element => {
		let clone = document.importNode(chipTemplate.content, true);
		const span = clone.querySelectorAll("SPAN");
		span[0].textContent = element;
		chipUl.appendChild(clone);
	});
	
}

async function viewDidLoad(){
	const storageController = new StorageController("keyword");
	const sendButton = document.querySelector(".button-element");
	const input = document.querySelector("#textArea");
	const chipUl = document.querySelector(".chip-list");

	let savedKeyword;
	try {
		savedKeyword = await storageController.getKeywordList();
	} catch (e) { 
		alert(e);
		return;
	}
	
	updateChip(savedKeyword);

	chipUl.addEventListener("click", async function(event) {
		const target = event.target;
		let keyword = getKeywordFromAction(target);
		if(keyword == null) return;
		try {
			await storageController.removeKeyword(keyword);
			savedKeyword = await storageController.getKeywordList();
			updateChip(savedKeyword);
			broadcastUpdateMessage();
		} catch (e) {
			alert(e);
		}

 	});

	sendButton.addEventListener("click", async function() {
		try {
			await storageController.saveKeywordFor(input.value)
			savedKeyword = await storageController.getKeywordList();
			updateChip(savedKeyword);
			broadcastUpdateMessage();
			input.value = "";
		} catch (e) {
			alert(e)
		}		
	});
}

document.addEventListener("DOMContentLoaded", function() {
	viewDidLoad();
});
