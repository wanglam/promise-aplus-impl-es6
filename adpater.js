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
