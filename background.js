chrome.tabs.onActivated.addListener(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0].url.includes("https://www.fmkorea.com")) {
            chrome.tabs.sendMessage(tabs[0].id, {text: ""});
        }

    })
})
      