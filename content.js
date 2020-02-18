
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		const titleTag = document.querySelectorAll("h3.title");
		for(let element of titleTag) {
			if(element.innerText.includes(request.text)) {
				element.offsetParent.style.display="none";
			}
		}
	});
	

