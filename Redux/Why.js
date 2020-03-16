//import * as actions from './actions.js';
//import reducers?
/* 
= 기존의 문제

    처음의 의도 : 데이터가 변화할때마다 storageController를 Observable화 시켜 통해 변화사실을 알리자.

    기존에는 storageController를 Observable로 만들었다.
    그리고 그것이 변화될때마다 구독자들에게 변화사실을 알렸다.
    예를들어, save(), delete() 시마다 구독한 객체들에게 모두 변화사실을 알렸다.
    만약 에러가 나올시 에러 사실을 알렸다.

    문제가생겼다. storageController.get()은 observable에 적합한 함수가 아니었다.
    왜냐하면, get() 은 변화된 상태를 업데이트하는게아니라 현재 상태를 보여주는것에 그친다.
    하지만 get()역시 파일입출력API를 사용하기에 에러가 나오기에 충분하다.

    문제점 1-1 : 일관성 ) 그럼 get()의 에러는 어떻게처리해하는가?
     - try~catch문으로 처리해야한다.
     - 반면 set,delete()는 subscribe(onError:)로 처리한다.
        => 일관적이지가 않다.

    문제점 1-2 : 일관성 ) 같은 storageController라도 set(),delete()의 결과는 subscribe(onNext:)로 받지만,
    get은 storageController의 객체에 직접 접근해서 실행시킨다.
     => 일관성이 없는 처리가 문제였다.

    문제점 2 : 의도 불분명) subscribe()의 의도가 묘연하다.
    (1) 만약 subscribe()가 "storage의 데이터 변화에 구독" 이라고한다면, subscribe(onError:)는 필요가없다.
    에러가 나면 데이터의 변화가 없기때문에 추가적으로 구독받을 이유도 없다.
    단순하게 데이터의 변화의 상태만 구독하기때문이다. 
    하지만 에러처리는 필수적으로 필요하다. 파일입출력이기떄문이다.

    (2) subscribe의 의미가 "모든 storageController에 binding된 Action에 대한 구독이라고해보자.
    에러가나면 해당 이벤트에 대한 에러이기때문에 이경우에서는 에러출력하는것이 합당하다.
    하지만 만약 UI가 없다면 어떡할까? UI가 없다면 누가 누구를 구독하고, 에러가나면 그 에러는 어느 액션으로부터 시작한 에러일까? 
    + (2)는 MVVM패턴에 근접하지만, 어떤경우 UI가 없고, 적합한 바인딩을 구현하지않았으므로 문제가생긴다.

    문제점 3 : storageController에 observable구현.    
    get(), set(), delete() 세가지 기능을 모두 observable로 만드려니까 기존에 짰던 코드의 논리와 맞지않았다.
    예를들어, set,delete는 observalbe하게 만들 수 있었으나, get까지 observable로 만드려니까 논리적으로 맞지않았다.
    set,delete도 역시 get을 불렀기때문인데, get결과를 모든 구독자들에게 알리면, set,delete, ui등 모든사람들이 쓸데없이 결과를 받기때문이다.
    따라서  StorageController기능위에 observable기능을 바인딩해줄 전용 객체가 필요하다.
    
    - 해결방안
    - StorageController에서 구독처리를 하지않고 단순하게 storage에 입출력에 대한 본연의 객체의 역할만 수행해야한다.
        - 적합한 구독방법이 필요하다. 
            - 이벤트 바인딩.
            - 데이터 바인딩.
    - 모든 경우의 수를 STATE(상태)객체로 만든다. UI는 항상 그 상태를 기반으로 읽고 업데이트를 해주면된다.

    단순하게 그 위에 구독하는것을 만들어줄 수 있지만, 어떤 상태를 안전하고 예측가능하게 기록하는 방법중에 FLUX패턴이 있으므로 그것을 이용해 해결해본다.
    


    CHROME EXTENSION개발환경에서의 문제점
    
    1) 하나의 공유된 스토어를 만들 수 없다는것이 문제였다. (공통된 인스턴스, 메인 인스턴스, 시작점 등..)
    각자 돌아가는 환경이 달라서 하나의 공통된 메인 인스턴스에서 (main.js 혹은 background.js) 해당 스토어를 돌릴 수 없었다.
    * content_script, popup.js, background.js 각각 다른 인스턴스에서 돌아간다.

    이 세가지 다른 인스턴스를 연결하기위해서 chrome api의 메세지 전달기능을 통해서 극복하고자하였으나,
    Chrome API send Message는 json을 stringfy해서 보내기때문에 function type은 전달이 안되었다.
    이 부분 개발을 위해서는 function type도 반드시 전달할 수 있어야 했기때문에 functiontype용 별도의 컴파일러를 개발했어야했다.
    전달된다고해도 action에서 미리정의한 함수들의 객체관계가 모두 끊어져서 에러가 생길게 뻔했다.
    
    2) 따라서 각각 다른환경마다 store를 여러개 둔다고 가정한다.
    content_script, popup.js 둘다 개별 스토어를 하나씩 두지만
    popup.js에서 스토어가 변경될떄마다 content_script에도 연락을 주는 방식으로 변경했다.
    이방식의 문제점은 각 인스턴스마다 필요한 모든 소스들을 import해줘야하는 문제들이 있다.

*/




// import { GET_KEYWORDS, 
//     GET_KEYWORDS_ERROR,
//     ADD_KEYWORDS, 
//     ADD_KEYWORDS_ERROR, 
//     REMOVE_KEYWORDS, 
//     REMOVE_KEYWORDS_ERROR } from './actions.js'


// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         eval(request.action_object);

//         //dispatch(compileFunction(request.action_object));

// });


// /*
// chrome.runtime.onConnect.addListener(port => {
//     console.log('connected ', port);

//     if (port.name === 'hi') {
//         port.onMessage.addListener(this.processMessage);
//     }
// });
// */

// // var port = chrome.runtime.connect({name: "redux"});

// /*
// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, {"action_object": action_object});
//     var port = chrome.runtime.connect({name: "redux"});

//     //set Time out...
//     //set TimeOUT_!!!!
//     //timeout걸어서 timeout이 안된다면.. queue..?
// });



// port.onMessage.addListener(function(request) {
//     alert(request)
// });
  

// chrome.runtime.onMessage.addListener(
//     async function(request, sender, sendResponse) {
//         alert(request);
//         //dispatch(request.action_object);
// });
// */

// function dispatch(action_object) {
//     if (typeof(action_object) === 'function') {
//         action_object(dispatch)
//     } else {
//         setState([action_object].reduce(reducer,initialState));
//     }
// }

// var initialState = {
//     errorMessage: "",
//     error: false,
//     items:[]
// }

// function setState(state){
//     initialState = state; //새로운 state로 덮어쓴다.
//     notifies(); //새로운 state를 전달한다.
// }

// function notifies(){
// 	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, {text: ""});
//    });
// }


// //reducer!!
