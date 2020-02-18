/**
 * @author Jiwoo, Choi
 * @brief HTML태그 중 게시글과 관련된 태그를 찾고 바꿔주는 스크립트.
 */

var titleTag = document.getElementsByClassName('title')
var titleArray = Array.from(titleTag)
var filteredArray = titleArray.filter(element=>element.tagName == "H3")
filteredArray.forEach(element => {
    if (element.innerText.includes("권상훈")) {
        element.offsetParent.style.display="None"
    }
});