const sendButton = document.querySelector("#sendBtn");
const input = document.querySelector("#textArea");
sendButton.addEventListener("click", () => {
	alert(input.value)
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		 chrome.tabs.sendMessage(tabs[0].id, {text: input.value});
	});
});
