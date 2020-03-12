const ERROR  = {
    INPUT_TYPE_ERROR: 'INPUT_TYPE_ERROR',
    STORAGE_FAIL    : 'STORAGE_FAIL',
    OUTOF_INDEX     : 'OUTOF_INDEX',
    DUPLICATE_KEY   : 'DUPLICATE_KEY',
    UNKONWN_ERROR   : 'UNKONWN_ERROR'
};

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

        //메인으로부터 업데이트 콜을 받기위해 모듈이 불릴떄부터 실행해둡니다.
        chrome.runtime.onMessage.addListener(
            async function(request, sender, sendResponse) {
                if (request.id == "update") {
                    this.update(request.eventlog);
                }
            }.bind(this)
        )
    }

    //실제 변경이 일어났을 경우에만 commit을 합니다.
    //에러까지 커밋을 해서 모두에게 뷰 업데이트사항을 알릴필요는 없습니다.
    //실패한 사항은 각 뷰나 js에서 대응을 해야합니다.
    //따라서 성공한 케이스에 대해서만 커밋을 날립니다. 
    //커밋하고 바로 dispatch를 해야하는가? 아니면 update가 올떄까지 기다려야하는가? (timing issue & promise & generator)
    commit(data) {
        alert("commit start")
        chrome.runtime.sendMessage({id:"commit" , eventlog: {"data": data, "status":  "SUCCESS"}})
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {id:"commit" , eventlog: {"data": data, "status":  "SUCCESS"}});
        });
        //contentscript -> generaljs : chrome.runtime.sendMessage
        //generaljs -> contentscript : chrome.tabs.query
    }

    //누군가가 커밋을 날려서 메인센터에서는 업데이트를 하라고 연락이 옵니다.
    //그럴때 업데이트를 해줍니다.
    update(eventlog){
        this.dispatch(eventlog);
    }
    /* 2-phase commit?
    vote(){
    }*/

    subscribe(callback){
        if (typeof callback != 'function') {
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
        let currentKeywords = await this.getKeywordList();

        if (!key) {
            //this.commit();
            this.dispatchWithEvent(currentKeywords,false, ERROR.INPPUT_NULL);
        } else {
            if (currentKeywords.indexOf(key) == -1) {
                currentKeywords.push(key);
                let tempDictionary = {};
                tempDictionary[this.keyword] = currentKeywords;
                chrome.storage.sync.set(tempDictionary, function() { 
                    if (!this.isStorageError()) {
                        this.commit(currentKeywords);
                        //this.dispatchWithEvent(currentKeywords,true);
                    } else {
                        //this.commit(currentKeywords,false,ERROR.STORAGE_FAIL);
                        this.dispatchWithEvent(currentKeywords,false,ERROR.STORAGE_FAIL);
                    }
                }.bind(this));
            } else {
                //this.commit(currentKeywords,false, ERROR.DUPLICATE_KEY);
                this.dispatchWithEvent(currentKeywords,false, ERROR.DUPLICATE_KEY);
            }
        }
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
                    this.commit(currentKeywords);

                    //this.dispatchWithEvent(currentKeywords,true);
                } else {
                    this.dispatchWithEvent(currentKeywords,false, STORAGE_FAIL);
                }
            }.bind(this));
        } else {
            this.dispatchWithEvent(currentKeywords,false, INPUT_TYPE_ERROR);
        }       
    }
}


//https://developer.chrome.com/extensions/runtime#method-connectNative
//pack download. // native apps.

    
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
	//데코레이터, 델리게이트, 프록시, 팩토리, 싱글톤.


	//delegate pattern for singleton pattern?
	//singleton(delegate)
	//delegate().subscribe();
