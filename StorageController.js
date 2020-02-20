export default class StorageController {
    constructor(keyword) {
        this.keyword = keyword;
    }

    async getKeywordList() {
        const self = this;
        return new Promise(function(resolve) {
            chrome.storage.sync.get([self.keyword], function(result) {
                let currentKeywords;
                currentKeywords = result.keyword
                currentKeywords = (currentKeywords == undefined) ? [] : currentKeywords; // avoid undefined case.
                resolve(currentKeywords)
            });
        })
    }
    
    async saveKeyword(key) {
        return new Promise(async function(resolve) {
            if (key !== "") {
                let currentKeywords = await this.getKeywordList();
                currentKeywords.push(key);
                chrome.storage.sync.set({"keyword": currentKeywords}, function() { 
                    resolve(true);
                });
            }
        }.bind(this));
    }
}