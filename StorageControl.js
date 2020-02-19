export default class StorageControl {

    constructor(keyword) {
        this.keyword = keyword
    }

    async getKeys() {
        return new Promise(function(resolve) {
            chrome.storage.sync.get([this.keyword], function(result) {
                let currentKeywords;
                currentKeywords = result.keyword
                currentKeywords = (currentKeywords == undefined) ? [] : currentKeywords; // avoid undefined case.
                resolve(currentKeywords)
            });
        })
    }
    
    async saveKey(key) {
        return new Promise(async function(resolve) {
            if (key !== "") {
                let currentKeywords = await getKeys()
                currentKeywords.push(key)
                dictTemp[this.keyword] = currentKeywords
                chrome.storage.sync.set(dictTemp, function() { 
                    resolve(true)
                });
            }
        })
    }
}

