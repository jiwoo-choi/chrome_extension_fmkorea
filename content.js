/**
 * @author Jiwoo, Choi
 * @brief HTML태그 중 게시글과 관련된 태그를 찾고 바꿔주는 스크립트.
 */

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	const titleTag = document.querySelectorAll("h3.title");
  	for(let element of titleTag) {
  		if(element.innerText.includes(request.text)) {
			element.offsetParent.style.display="none";
  		}
  	}
});
