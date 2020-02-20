import StorageController from './StorageController.js';

function viewDidLoad(){
	const stoargeController = new StorageController("keyword");

	const sendButton = document.querySelector("#sendBtn");
	const input = document.querySelector("#textArea");

	sendButton.addEventListener("click", async function() {
		stoargeController.saveKeyword(input.value).then(result => {
			if(result == true) {
				sendKeyword(input.value);
			} else {
				console.log("something wrong");
			}
		});
	});
}

function sendKeyword(keywordList) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {keyword: keywordList}); //
	});
}



document.addEventListener("DOMContentLoaded", function() {
	viewDidLoad()
});




