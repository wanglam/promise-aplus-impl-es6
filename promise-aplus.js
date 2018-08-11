function wrapperTimeoutZero(func){
	return function() {
		const args = arguments;
		setTimeout(function(){
			func.apply(null, args);
		}, 0);
	};
}

function execCallbacks(callbacks, value){
	for (let i = 0; i < callbacks.length; i++) {
		callbacks[i](value);
	}
}

function isThenable(obj){
	return obj && (typeof obj === "function" || typeof obj === "object") && "then" in obj;
}

class Promise {
	constructor(promiseBody) {
		this.initProperties();
		this.execPromiseBody(promiseBody);
	}

	execPromiseBody(promiseBody){
		try {
			promiseBody.call(null, this.execResolve, this.execReject);
		} catch (e) {
			this.execReject(e);
		}
	}

	initProperties(){
		this.status = "pending";
		this.value = undefined;
		this.fulfilledCallbacks = [];
		this.rejectedCallbacks = [];

		this.execResolve = (data) => {
			if (this.status === "pending") {
				this.status = "fulfilled";
				this.value = data;
				execCallbacks(this.fulfilledCallbacks, data);
			}
		};
    
		this.execReject = (reason) => {
			if (this.status === "pending") {
				this.status = "rejected";
				this.value = reason;
				execCallbacks(this.rejectedCallbacks, reason);
			}
		};

		this.execResolve = wrapperTimeoutZero(this.execResolve);
		this.execReject = wrapperTimeoutZero(this.execReject);
	}

	then(onFulfilled, onRejected){
		const returnedPromise = new Promise(wrapperTimeoutZero(
			(resolve, reject) => {
				const runFuncResult = (result) => {
					if ( isThenable(result) ) {
						if (result === returnedPromise) {
							reject(new TypeError("Can't be same!"));
							return ;
						}
						let then = null;
						try {
							then = result.then;
						}catch (e) {
							reject(e);
							return ;
						}

						if (typeof then !== "function") {
							resolve(result);
							return ;
						}

						let isRunFulfilledOrRejected = false;
						const onlyOnce = function(func){
							return function(){
								if (!isRunFulfilledOrRejected) {
									isRunFulfilledOrRejected = true;
									func.apply(null, arguments);
								}
							};
						};

						try{
							then.call(result, onlyOnce(function(data){
								if (isThenable(data)) {
									runFuncResult(data);
								} else {
									resolve(data);
								}
							}), onlyOnce(function(reason){
								reject(reason);
							}));
						} catch (e) {
							if (!isRunFulfilledOrRejected) {
								reject(e);
								return ;
							}
						}
					} else {
						if (result instanceof Error) {
							reject(result);
						} else {
							resolve(result);
						}
					}
				};
				const execResultAndCheckSame = (func, data, notFuncCb) => {
					if (typeof func !== "function") {
						notFuncCb(data);
						return;
					}
					let result = null;
					try{
						result = func(data);
					} catch ( e ){
						reject(e);
						return ;
					}
					runFuncResult(result);
				};
				const execOnFulfilled = function(data) {
					execResultAndCheckSame(onFulfilled, data, resolve);
				};
				const execOnRejected = function(reason) {
					execResultAndCheckSame(onRejected, reason, reject);
				};
				if (this.status === "pending") {
					this.fulfilledCallbacks.push(execOnFulfilled);
					this.rejectedCallbacks.push(execOnRejected);
				} else {
					(this.status === "fulfilled" ? execOnFulfilled : execOnRejected)(this.value);
				}
			}
		));
		return returnedPromise;
	}
}

module.exports = Promise;

