export function createStore(reducer, initialState = {items : [], error: false, errorMessage : ""}) {
    return new Store(reducer,initialState);
}

class Store {

    constructor(reducer, initialState) {
        this.state = initialState;
        this.reducer = reducer;
        this.render = null;

        //not scalable!
        this.dispatch = this.dispatch.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.notifies = this.notifies.bind(this);
        this.getState = this.getState.bind(this);
    }

    subscribe(render) {
        this.render = render;
    }

    getState(){
        return this.state;
    }

    dispatch(action) {
        if (typeof(action) === 'function') {
            action(this.dispatch)
        } else {
            this.state = [action].reduce(this.reducer,this.state);
            this.notifies();
        }
    }
    
    notifies() {
        if (this.render) {
            this.render();
        }
    }
}

//redux pattern.


// how to do proxy and generator....?
    // if this state changed, not work...?
    //if this state is changed..?
    //then call setState();

    // this.state = new Proxy(target, {
    //     set(target, property, value, receiver) {
    //       let success = Reflect.set(...arguments); 
    //       if (success) { 
    //         target[handlers].forEach(handler => handler(property, value));
    //       }
    //       return success;
    // )}})



// import { GET_KEYWORDS, 
//     GET_KEYWORDS_ERROR,
//     ADD_KEYWORDS, 
//     ADD_KEYWORDS_ERROR, 
//     REMOVE_KEYWORDS, 
//     REMOVE_KEYWORDS_ERROR } from './actions.js'


// export default class Store  {



//     constructor() {
//         //현재 상태
//         this.state = {};
//         //new proxy 
//         this.render = undefined;
//         this.state = this.getState();
//         /*
//         this.state = (target)=>{
//             target.observe = (handler) => {
//                 target[handlers].push(handler);
//             }
//         }*/

//         //새로운 state가 업데이트될떄마다 업데이트 사항 전달.
//         // this.state.observe(()=>{
//         //     this.renders.forEach((element) => element());     
//         // })

//         /*
//         chrome.runtime.onMessage.addListener(
//             async function(request, sender, sendResponse) {
//                 this.state = request.state;
//                 this.notifies();
//         });*/

//         //처음 state를 어떻게받아올것인가.

//         //proxy를 활용한 observable (옵저버패턴)
//         //subscribe로 새로운 값이 들어오면 알림오게?
//         //subscribe로 새로운값이 안들어오면 알림안오게?
//         //에러는 어떻게표시할건지? state로 표시하기...
//         //구독으로 정보를 받기..
//         //에러표시가문제 => 에러를 어떻게 표시할것인지...
//         //2초후에는 그걸 발생시켜야하는데, 그게 안되니까 문제가생기는것. 2초후에까지 못받으면 TIME OUT발생시키기.
//         //단순 구독용으로 쓸거면 쓸모가없는게문제.
//         //https://ko.javascript.info/task/observable


//         //producer-consumer 패턴. => 너무복잡합.
//         //생상하고 1초후에 안받으면 끝. 프로듀서는 ㅖㄲ속 동기적으로 생산함?
//         //this.pipeline = this.pipeline();
//         //리듀서와 연결하는 파이프라인.
//         //생산라인이문제 생산 -> 멈추기 -> 받기
//         //생산자가 들어갔으면 -> 컨슈머에게 받으라고 알림을줘야해 wait하고있는 consumer는 받는다.
//         //generator 패턴 사용해서 generator잘 활용하고있는지 확인.(TO를 걸어줘야해)
//         /*

//         asObservable(target){
//             target[handlers] = [];
//             target.observe = function(handler) {
//                 this[handlers].push(handler);
//             };
            
//             return new Proxy(target, {
//                 set(target, property, value, receiver) {
//                     let success = Reflect.set(...arguments); // 동작을 객체에 전달합니다.
//                     if (success) { // 에러 없이 프로퍼티를 제대로 설정했으면
//                     // 모든 핸들러를 호출합니다.
//                     target[handlers].forEach(handler => handler(property, value));
//                     }
//                     return success;
//                 },
//                 get(){

//                 }
//                 })
            
//         }
//         */

//     }

//     subscribe(render){
//         this.render = render;
//         //this.renders.push(render);
//     }


//     getState(){
//         return this.state;
//     }
    
//     //https://developer.chrome.com/extensions/messaging
//     //port?

//     dispatch(action_object){
//         //storage Controller가활약을못함.
//         /*chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//             chrome.tabs.sendMessage(tabs[0].id, {"action_object": action_object});
//         });*/
//         //chrome.runtime.sendMessage({"greeting": action_object })
        
//         //var a = (date) => {console.log(date)};
//         //chrome.runtime.sendMessage({action_object:a.toString()});

//         /*

//         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//             chrome.tabs.sendMessage(tabs[0].id, {"action_object": action_object});
//             //set Time out...
//             //set TimeOUT_!!!!
//             //timeout걸어서 timeout이 안된다면.. queue..?
//         });
//         chrome.runtime.sendMessage({"action_object": action_object })
//           */
//         /* 
//             //만약 function type이라면 dispatch()를 action에서 실행해줍니다.
//         if (typeof(action_object)== 'function') {
//             action_object(this.dispatch)
//         } else {
//             this.pipeline.next();
//             this.pipeline.next(action_object);

//             //this.callReducer().
//             //리듀서를 실행합니다. 리듀서큐늖 ㅏㅇ상도는중입니다.
//             //리듀서
//             //yield
//             //받을떄까지멈춥니다.
//             //받을때는
//             //만약 객체가 들어왔다면 reducer에 돌려줍니다.
//             //reducer는 store가 가지고있으므로 store에게 보내줍니다.
//             //promise를 통해 받는다는 보장이 없습니까? 어떻게알까요? iterator function으로 해야할까요?
//         }
//         //액션 타입이 있다면 그 리듀서를 이용해서 만듭니다.
//         //initial state가 있다면 initial state를 받습니다.
//         */
//     }

//     notifies(){
//         if (this.render !== undefined) {
//         } else {
//             this.render();
//         }
//     }


//     //업데이트를 했는데 일정시간동안 못받았어.
//     //그러면 error발생시켜야함.
//     //producer <-> consumer

//     /*
//     일단 내가 자료를 request를 합니다. (quueue)
//     그리고 자료를 넣습니다. 3초있다가 consuming하게합니다.
//     프로듀서로 -> 넣고, 3초있다가 컨슈밍하게합니다.
//     -> 큐에 뭐가 들어왔다. 그럼 그걸 컨슈밍하게한다.
//     https://gist.github.com/narqo/8173984
// https://medium.com/@jooyunghan/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%A0%9C%EB%84%88%EB%A0%88%EC%9D%B4%ED%84%B0%EC%9D%98-%EC%9E%AC%EB%AF%B8-246553cadfbd
//    https://hamait.tistory.com/550
//    생산자는 동기적으로 넣어줘야한다. 
//     */
//     /*
//     *pipeline(){
//         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//              chrome.tabs.sendMessage(tabs[0].id, {newState: yield});
//        });
//        yield notifies(); //render 불러.
//     }
    

//     *producer(){
//         while(true){
//             yield write(i)
//           }
//     }

//     *consumer() {
//         let v
//         while (typeof (v = yield read()) !== "undefined") {
//           console.log("read:", v)
//         }
//     }
      
//     write(i){ //consumer가 읽게해줌.
//         this.queue.push(i);
//         this.consumerG.next();
//     }

//     read(){//producer lock풀어줌.
//         this.queue.shift(0);
//         this.consumerG.next();
//     }

//     //observable?
//     //
//     */



//     /*
//     *callReducer(){
//         yield chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//              chrome.tabs.sendMessage(tabs[0].id, {newState: action_object});
//        });
//     */
//        //여기서받아서처리할때까지 아무것도못함.
//        //받을떄까지대기해야함.

//        //call yield.
//        //callReducer-> 
//        // 여기서 yield하게되면 yield한부분부터 시작해서 부른다.
// }

// /*
//     new Provider(render);
// */


// /* 
//     view쪽은
//     store.dispatch(action객체전달)

//     store쪽은 dispatch가 불리면 action객체를 전달받는다.
//     //reducer를실행시키고..
//     //reducer를 실행시키고 값을 전달
//     //sotre는 리듀서를 받아와서 값을 전달.
//     //리듀서를 통해 받은 값을 저장하고 그 값을 notifies.

//     //action dispatch(actions)
// */
