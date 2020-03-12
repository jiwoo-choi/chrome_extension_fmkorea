import StorageController from './StorageController.js';

/*
function broadcastUpdateMessage() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		 chrome.tabs.sendMessage(tabs[0].id, {text: ""});
	});
}*/
//https://nillk.tistory.com/27

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

	/*
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {"message":StorageController.method1()});
   });*/



	const storageController = new StorageController("keyword");
	const sendButton = document.querySelector(".button-element");
	const input = document.querySelector("#textArea");
	const chipUl = document.querySelector(".chip-list");


	const result = await storageController.getKeywordList();
	updateChip(result);
	
	storageController.subscribe((event)=> {
		switch(event.status) {
			case "SUCCESS":
				updateChip(event.data);
				//broadcastUpdateMessage();
				break;
			case "FAILRUE":
				alert(event.status);
				alert(event.message);
				break;
		}
	})


	// Note
	//addsomething 
	//add and call render();
	//rxswift
	//flux pattern.
	//observer => calling them -> reducer.
	//observer => calling storageController.subscribe(this)
	//and this will call everytime. function을 매번부른다.
	//if add some variables => and this updated something.

	//data updated.. and how?

	chipUl.addEventListener("click", async function(event) {
		const target = event.target;
		let keyword = getKeywordFromAction(target);
		if(keyword == null) return;
		await storageController.removeKeyword(keyword);
 	});

	sendButton.addEventListener("click", async function() {
		await storageController.saveKeywordFor(input.value)
		input.value = "";
	});
}

document.addEventListener("DOMContentLoaded", function() {
	viewDidLoad();
});


//https://www.google.com/search?q=dispoasbag%EC%9B%90%EB%A6%AC&oq=dispoasbag%EC%9B%90%EB%A6%AC&aqs=chrome..69i57j0l7.3378j0j7&sourceid=chrome&ie=UTF-8
//diff algorithm.
//https://magi82.github.io/ios-rxswift-03/
//https://rhammer.tistory.com/286
