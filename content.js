
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		const keywordList = request.keyword;

		console.log(keywordList);
		const titleTag = document.querySelectorAll("h3.title");
		for(let element of titleTag) {
			for(const keyword of keywordList) {
				if(element.innerText.includes(keyword)) {
					element.offsetParent.style.display = "none";
				}
			}
		}
	});
	

