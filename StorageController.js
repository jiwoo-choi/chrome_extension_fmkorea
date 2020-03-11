const ERROR  = {
    INPUT_TYPE_ERROR: 'INPUT_TYPE_ERROR',
    STORAGE_FAIL    : 'STORAGE_FAIL',
    OUTOF_INDEX     : 'OUTOF_INDEX',
    DUPLICATE_KEY   : 'DUPLICATE_KEY',
    UNKONWN_ERROR   : 'UNKONWN_ERROR'
};

//enum RESULT<T, E:Error>
//case SUCCESS(T)
//case FAILRUE(E)
const RESULT = {
    SUCCESS : function(data) {
       return {"status": "SUCCESS", data: data}
    },
    FAILURE : function(error) {
        return {"status": "FAILURE", error: error}
    },
}

// resolve(RESULT.SUCCESS(data))
// resolve(RESULT.FAILURE(error))
/* 
const result = fetch(..)
switch(result.stauts) {
    case "SUCCESS": //success(let data)
        result.data
    case "FAILRUE": //.failure(let error)
        result.error )
}*/

export default class StorageController {

    constructor(keyword) {
        this.keyword = keyword;
        this.isStorageError = () => {
            if (chrome.runtime.lastError) {
                return true;
            } else {
                return false;
            }
        }
        this.payloads = [];
    }

    subscribe(callback){

        if (typeof callback != 'function'){
            return false;
        }
        
        this.payloads.push(callback);

    }

    unsubscribe(){
        this.payloads = [];
    }

    dispatch(eventlog){ 
        this.payloads.forEach((event)=>{
            event(eventlog)
        })
    }

    dispatchWithEvent(data, status, message="") {
        return this.dispatch({"data": data, "status": status ? "SUCCESS" : "FAILRUE", message:message})
    }

    
    // async programming?
    // *eventGenerator(){
    //     yield abc;
    // }
    //https://medium.com/@muhammad_hamada/simple-event-dispatcher-implementation-using-javascript-36d0eadf5a11
    //https://exploringjs.com/impatient-js/ch_sync-generators.html
    //https://velog.io/@rohkorea86/Generator-%ED%95%A8%EC%88%98%EB%A5%BC-%EC%9D%B4%ED%95%B4%ED%95%B4%EB%B3%B4%EC%9E%90-%EC%9D%B4%EB%A1%A0%ED%8E%B8-%EC%99%9C-%EC%A0%9C%EB%84%A4%EB%A0%88%EC%9D%B4%ED%84%B0-%ED%95%A8%EC%88%98%EB%A5%BC-%EC%8D%A8%EC%95%BC-%ED%95%98%EB%8A%94%EA%B0%80
    // queue process 1 : excute -> and wait -> til 
    // queue process 2 : excute -> and wait .. ?
    // queue process 3 : promise() promise() promise()
    // queue process 4 : or single thread.. excuting.
    //https://ui.toast.com/weekly-pick/ko_20150904/
    //https://9105lgm.tistory.com/150

    async getKeywordList() {
        return new Promise(function(resolve, reject) {
            try {
                chrome.storage.sync.get([this.keyword], function(result) { // this will call-back any value.
                    let currentKeywords;
                    currentKeywords = result.keyword;
                    currentKeywords = (currentKeywords == undefined) ? [] : currentKeywords; // avoid null.
                    if (!this.isStorageError()) {
                        resolve(currentKeywords);
                    } else {
                        reject(ERROR.STORAGE_FAIL);
                    }
                }.bind(this));
            } catch (err) {
                reject(ERROR.UNKONWN_ERROR);
            }
        }.bind(this));
    }

    async saveKeywordFor(key) {

        if (!key) {
            this.dispatchWithEvent(currentKeywords,false, ERROR.INPPUT_NULL);
        } else {
            let currentKeywords = await this.getKeywordList();
            if (currentKeywords.indexOf(key) == -1) {
                currentKeywords.push(key);
                let tempDictionary = {};
                tempDictionary[this.keyword] = currentKeywords;
                chrome.storage.sync.set(tempDictionary, function() { 
                    if (!this.isStorageError()) {
                        this.dispatchWithEvent(currentKeywords,true);
                    } else {
                        this.dispatchWithEvent(currentKeywords,false,ERROR.STORAGE_FAIL);
                    }
                }.bind(this));
            } else {
                this.dispatchWithEvent(currentKeywords,false, ERROR.DUPLICATE_KEY);
            }
        }

        /*
        return new Promise(async function(resolve, reject) {
            try {
                if (!key) {
                    resolve(RESULT.FAILURE(ERROR.INPPUT_NULL));
                } else {
                    let currentKeywords = await this.getKeywordList();
                    if (currentKeywords.indexOf(key) == -1) {
                        currentKeywords.push(key);
                    } else {
                        resolve(RESULT.FAILURE(ERROR.DUPLICATE_KEY));
                    }

                    let tempDictionary = {};
                    tempDictionary[this.keyword] = currentKeywords;
                    chrome.storage.sync.set(tempDictionary, function() { 
                        if (!this.storageErrorChecker()) {
                            resolve(RESULT.SUCCESS(null));
                        } else {
                            resolve(RESULT.FAILURE(ERROR.STORAGE_FAIL))
                        }
                    }.bind(this));
                }
                this.dispatchWithEvent(currentKeywords,true);
            } catch (err) {
                resolve(RESULT.FAILURE(ERROR.UNKONWN_ERROR + err));
            }
        }.bind(this));
        */
    }

    async removeKeyword(keyword) {

        let currentKeywords = await this.getKeywordList();
        const removeItemIndex = currentKeywords.indexOf(keyword);
        if (removeItemIndex > -1) {
            currentKeywords.splice(removeItemIndex, 1);
            let tempDictionary = {}
            tempDictionary[this.keyword] = currentKeywords;
            chrome.storage.sync.set(tempDictionary, function() {
                if (!this.isStorageError()) {
                    this.dispatchWithEvent(currentKeywords,true);
                } else {
                    this.dispatchWithEvent(currentKeywords,false, STORAGE_FAIL);
                }
            }.bind(this));
        } else {
            this.dispatchWithEvent(currentKeywords,false, INPUT_TYPE_ERROR);
        }
       


        /*
        return new Promise(async function(resolve, reject) {
            try {
                let currentKeywords = await this.getKeywordList();
                const removeItemIndex = currentKeywords.indexOf(keyword);
                if (removeItemIdex > -1) {
                    currentKeywords.splice(removeItemIndex, 1);
                } else {
                    resolve(RESULT.FAILURE(ERROR.INPUT_NULL))
                }
                tempDictionary[this.keyword] = currentKeywords;
                chrome.storage.sync.set(tempDictionary, function() {
                    if (!this.storageErrorChecker()) {
                        resolve(RESULT.SUCCESS(null))
                    } else {
                        resolve(RESULT.FAILURE(ERROR.STORAGE_FAIL))
                    }
                }.bind(this));
                this.dispatchWithEvent(currentKeywords,true);
            } catch (err) {
                resolve(RESULT.FAILURE(ERROR.UNKONWN_ERROR + err))
            }
        }.bind(this));;
        */
    }
}
