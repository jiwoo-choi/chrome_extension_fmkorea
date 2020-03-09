const ERROR  = {
    SUCCESS         : 'SUCCESS',
    INPUT_NULL      : 'INPUT NULL',
    STORAGE_FAIL    : 'STORAGE FAIL',
    OUTOF_INDEX     : 'OUTOF_INDEX',
    DUPLICATE_KEY   : 'DUPLICATE_KEY'
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
                if (!this.storageErrorChecker()) {
                    resolve(currentKeywords);
                } else {
                    reject(ERROR.STORAGE_FAIL);
                }
            }.bind(this));
        }.bind(this));
    }

    async saveKeywordFor(key) {
        return new Promise(async function(resolve, reject) {
            if (key == "") {
                reject(ERROR.INPPUT_NULL);
            } else {

                let currentKeywords = await this.getKeywordList();
                if (currentKeywords.indexOf(key) == -1) {
                    currentKeywords.push(key);
                } else {
                    reject(ERROR.DUPLICATE_KEY);
                }

                let tempDictionary = {};
                tempDictionary[this.keyword] = currentKeywords;
                chrome.storage.sync.set(tempDictionary, function() { 
                    if (!this.storageErrorChecker()) {
                        resolve(ERROR.SUCCESS);
                    } else {
                        reject(ERROR.STORAGE_FAIL);
                    }
                }.bind(this));
            }
        }.bind(this));
    }

    async removeKeyword(keyword) {
        return new Promise(async function(resolve, reject) {
            let currentKeywords = await this.getKeywordList();
            const removeItemIndex = currentKeywords.indexOf(keyword);

            if (keyword) {
                currentKeywords.splice(removeItemIndex, 1);
            } else {
                reject(ERROR.INPUT_NULL);
            }

            let tempDictionary = {};
            tempDictionary[this.keyword] = currentKeywords;
            chrome.storage.sync.set(tempDictionary, function() {
                if (!this.storageErrorChecker()) {
                    resolve(ERROR.SUCCESS);
                } else {
                    reject(ERROR.STORAGE_FAIL);
                }
            }.bind(this));
        }.bind(this));;
    }
}
