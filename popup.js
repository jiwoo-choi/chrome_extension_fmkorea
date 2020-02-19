
//when loaded this should be called.
function viewDidLoad(){
	updateChipUI().then(keywordList => {
		// stoarge 에 있던 데이터 삭제
		sendKeyword(keywordList);
	});

	const sendButton = document.querySelector("#sendBtn");
	const input = document.querySelector("#textArea");

	sendButton.addEventListener("click", () => {
		// 추가 후 삭제
		saveKeyword(input.value).then(keywordList => {
			sendKeyword(keywordList);
		});
	});
}

function sendKeyword(keywordList) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {keyword: keywordList}); //
	});
}

function reteriveCurrentKeywordList(){
	return new Promise(function(resolve) {
		chrome.storage.sync.get(['keyword'], function(result) {
			let currentKeywordList;
			currentKeywordList = result.keyword
			currentKeywordList = (currentKeywordList == undefined) ? [] : currentKeywordList; // avoid undefined case.
			resolve(currentKeywordList)
		});
	})
}

async function saveKeyword(key){
	if (key !== "") {
		let currentKeywordList = await reteriveCurrentKeywordList()
		currentKeywordList.push(key)   
		alert(currentKeywordList)
		chrome.storage.sync.set({'keyword': currentKeywordList}, function() { 
			updateChipUI();
		});	
		return currentKeywordList;
	}
}

async function updateChipUI(){	
	const keywordList = await reteriveCurrentKeywordList();
	return keywordList;
}

document.addEventListener("DOMContentLoaded", function(){viewDidLoad()}, false);




