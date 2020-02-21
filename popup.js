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

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {keyword: keywordList}); //
	});
}

document.addEventListener("DOMContentLoaded", function() {
	viewDidLoad()
});




