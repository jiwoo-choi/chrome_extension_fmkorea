const btn = document.querySelector("button");
const filterTextArea = document.querySelector("textarea");

btn.addEventListener("click", () => {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
 		chrome.tabs.sendMessage(tabs[0].id, {text: filterTextArea.value});
	});
});
