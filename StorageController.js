const ERROR  = {
    SUCCESS     : 'SUCCESS',
    INPPUT_NULL : 'INPUT NULL',
    STORAGE_FAIL: 'STORAGE FAIL',
};

export default class StorageController {

    constructor(keyword) {
        this.keyword = keyword;
        this.storageErrorChecker = () => {
            if (chrome.runtime.lastError) {
                return true;
            } else {
                return false;
            }
        }
    }
    
    async getKeywordList() {
        return new Promise(function(resolve, reject) {
            chrome.storage.sync.get([this.keyword], function(result) { // this will call-back any value.
                let currentKeywords;
                currentKeywords = result.keyword;
                currentKeywords = (currentKeywords == undefined) ? [] : currentKeywords; // avoid null.
                if (!this.storageErrorChecker()){
                    resolve(currentKeywords) 
                } else {
                    reject(ERROR.STORAGE_FAIL)
                }
            }.bind(this));
        }.bind(this))
    }

    async saveKeyword(key) {
        return new Promise(async function(resolve, reject) {
            if (key == "") {
                reject(ERROR.INPPUT_NULL);
            } else {
                let currentKeywords = await this.getKeywordList();
                currentKeywords.push(key);
                tempDictionary[this.keyword] = currentKeywords;
                chrome.storage.sync.set(tempDictionary, function() { 
                    if (!this.storageErrorChecker()) {
                        resolve(ERROR.SUCCESS);
                    } else {
                        reject(ERROR.STORAGE_FAIL);
                    }
                }.bind(this))
            }
        }.bind(this))
    }
}
