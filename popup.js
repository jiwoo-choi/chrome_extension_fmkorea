import StorageController from './StorageController.js';

async function viewDidLoad(){

	const stoargeController = new StorageController("keyword");
	const sendButton = document.querySelector(".button-element");
	const input = document.querySelector("#textArea");

	const chip = (text, index) => {
		return "<div class='chip-container' id=chip-"+index+"> <div>"+ text +"</div> <div class='chip-container-x'>✘</div></div>"
	}
	const savedKeyword = await stoargeController.getKeywordList();

	const updateChip = (keywordList) => {
		let inputArea = document.querySelector("#chipArea");
		inputArea.innerHTML = keywordList.reduce((prev,curr,index)=>{
			prev += chip(curr, index);
			return prev;
		},"");

		keywordList.map((value,index) => {
			let idTags = "#chip-" + index
			let chips = document.querySelector(idTags);
			chips.addEventListener("click", async () => {
				await stoargeController.removeKeywordAt(index);
				const newSavedKeyword = await stoargeController.getKeywordList();
				updateChip(newSavedKeyword);
			})
		})
	}

	updateChip(savedKeyword);

	sendButton.addEventListener("click", async () => {
		await stoargeController.saveKeywordFor(input.value);
		const newSavedKeyword = await stoargeController.getKeywordList();
		updateChip(newSavedKeyword);
		input.value = "";
	})
	/*
	sendButton.addEventListener("click", async () => {
		addChip(input.value);
		input.value = "";

		await stoargeController.saveKeyword(input.value)
			.then( result => { 
				braodcastUpdateMessage() ;
			})
	})*/
}

function braodcastUpdateMessage() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		 chrome.tabs.sendMessage(tabs[0].id, {text: input.value});
	});
}

document.addEventListener("DOMContentLoaded", function() {
	viewDidLoad();
});
