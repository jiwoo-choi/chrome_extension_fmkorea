const ERROR  = {
    SUCCESS     : 'SUCCESS',
    INPUT_NULL : 'INPUT NULL',
    STORAGE_FAIL: 'STORAGE FAIL',
    OUTOF_INDEX : 'OUTOF_INDEX'
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
        }.bind(this));
    }

    async saveKeywordFor(key) {
        return new Promise(async function(resolve, reject) {
            if (key == "") {
                reject(ERROR.INPPUT_NULL);
            } else {
                let currentKeywords = await this.getKeywordList();
                currentKeywords.push(key);
                let tempDictionary = {};
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

    async removeKeywordAt(index){
        return new Promise(async function(resolve, reject) {
            let currentKeywords = await this.getKeywordList();
            if (currentKeywords.length < index) {
                reject(OUTOF_INDEX);
            } else {
                let tempDictionary = {};
                currentKeywords.splice(index,1);
                tempDictionary[this.keyword] = currentKeywords
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
            console.log(currentKeywords);

            if(removeItemIndex > -1) {
                currentKeywords.splice(removeItemIndex, 1);
            } else {
                reject(ERROR.INPUT_NULL);
            }

            // chrome storage sync set 함수를 분리해야할듯
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
