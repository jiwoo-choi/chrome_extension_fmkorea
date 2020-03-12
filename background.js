
/*chrome.tabs.onActivated.addListener(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0].url.includes("https://www.fmkorea.com")) {
            chrome.tabs.sendMessage(tabs[0].id, {text: ""});
        }   
    })
})*/

var tabs = 0;
chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        console.log(request);
        if (request.id === "commit") {
            chrome.runtime.sendMessage({"id":"update" , "eventlog": request.eventlog})
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {eventlog: request.eventlog, "id":"update"})
            });            
        //contentscript -> generaljs : chrome.runtime.sendMessage
        //generaljs -> contentscript : chrome.tabs.query
    }}
)