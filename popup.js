
//when loaded this should be called.
function viewDidLoad(){
	updateChipUI()
	const sendButton = document.querySelector("#sendBtn");
	const input = document.querySelector("#textArea");

	sendButton.addEventListener("click", () => {

		/*
		chrome.storage.sync.set({'keyword': 'av'}, function() {
			// Notify that we saved.
			//if null?
		  });*/
		saveKeyword(input.value);

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {text: input.value}); //
		});

	});

}

function reteriveCurrentKeywordList(){
	return new Promise(function(resolve) {
		chrome.storage.sync.get(['keyword'], function(result) {
			let currentKeywords;
			currentKeywords = result.keyword
			currentKeywords = (currentKeywords == undefined) ? [] : currentKeywords; // avoid undefined case.
			resolve(currentKeywords)
		});
	})
}

async function saveKeyword(key){
	if (key !== "") {
		let currentKeywords = await reteriveCurrentKeywordList()
		currentKeywords.push(key)   
		alert(currentKeywords)
		chrome.storage.sync.set({'keyword': currentKeywords}, function() { 
			updateChipUI();
		});	
	}
}

async function updateChipUI(){	
	const keywordLists = await reteriveCurrentKeywordList();
	alert(keywordLists)
}

document.addEventListener("DOMContentLoaded", function(){viewDidLoad()}, false);




