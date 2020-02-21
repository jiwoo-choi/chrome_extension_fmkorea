<<<<<<< HEAD
const sendButton = document.querySelector("#sendBtn");
const input = document.querySelector("#textArea");



const addChip = (text) => {
	let tag = "<div class='md-chip'> <span>" + text + "</span> <button type='button' class='md-chip-remove'></button></div>"
	let inputArea = document.querySelector("#chipArea");
	inputArea.innerHTML = inputArea.innerHTML + tag;
}

sendButton.addEventListener("click", () => {
	addChip(input.value);
	input.value = "";

=======
import StorageController from './StorageController.js';

function viewDidLoad(){
	const stoargeController = new StorageController("keyword");

	const sendButton = document.querySelector("#sendBtn");
	const input = document.querySelector("#textArea");

	sendButton.addEventListener("click", async function() {
		stoargeController.saveKeyword(input.value)
		.then(result => { sendKeyword(result) })
		});
}

function sendKeyword(keywordList) {
>>>>>>> 413df68ab62d5a41df8c0f0f2aed4873420332aa
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {keyword: keywordList}); //
	});
}

document.addEventListener("DOMContentLoaded", function() {
	viewDidLoad()
});




