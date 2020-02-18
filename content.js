
var titleTag = document.getElementsByClassName('title')
var titleArray = Array.from(a)
var filteredArray = b.filter(element=>element.tagName == "H3")
filteredArray.forEach(element => {
    element.innerText = "동연아 공부해야지?"
});