const Promise = require("./promise-aplus");

function resolved(value){
    return new Promise((resolve) => {
        resolve(value)
    });
}

function rejected(reason){
    return new Promise((_resolve, reject) => {
        reject(reason)
    });
}

function deferred(){
    let resolve = null;
    let reject = null;
    const promise = new Promise(function(innerResolve, innerReject){
        resolve = innerResolve;
        reject = innerReject;
    })
    return {
        promise,
        resolve,
        reject,
    }
}

module.exports = {
    deferred,
    resolved,
    rejected,
}


function deferred(){
    let resolve = null;
    let reject = null;
    const promise = new Promise(function(innerResolve, innerReject){
        resolve = innerResolve;
        reject = innerReject;
    })
    return {
        promise,
        resolve,
        reject,
    }
}

// const a = "123";

// rejected("123").then(null, ()=>{
//     return a;
// }).then(function(value){
//     console.log(value === a);
// }, function(reason){
//     console.log(reason)
// })

const a  = {}

// function xFactory() {
//     return Object.create(null, {
//         then: {
//             get: function () {
//                 // ++numberOfTimesThenWasRetrieved;
//                 return function thenMethodForX(onFulfilled, onRejected) {
//                     // setTimeout(function(){
//                         // onFulfilled({
//                         //     then: function(onFulfilled) {
//                         //         setTimeout(function(){
//                         //             onFulfilled(78999)
//                         //         }, 0);
//                         //     }
//                         // });
//                         // onRejected(Promise.reject(12345));
//                     // throw {};
//                 };
//             }
//         }
//     });
// }

// resolved(123).then(() => {
//     return xFactory()
// }).then((data) => {
//     console.log(data);
// }, (e) => {
//     console.log('reject...');
//     console.log( e );
// })

// rejected(123).then(null, () => {
//     return {
//         then(onFulfilled, onRejected){
//             onRejected({
//                 then(onFulfilled){
//                     onFulfilled(123)
//                 }
//             })
//         }
//     }
// }).then((data) => {
//     console.log(data);
// }, (e) => {
//     console.log(e);
// })

// resolved(123).then(() => {
//     return {
//         then: 5
//     }
// }).then((data) => {
//     console.log(data);
// });