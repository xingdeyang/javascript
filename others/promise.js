// 一个简易的defer/promise实现

function Promise () {
    this.isPromise = true
    this.queue = []
}

Promise.prototype.then = function (successCallback, failCallback) {
    var handler = {}
    if (!successCallback && !failCallback) {
        return;
    }
    if (typeof successCallback == 'function') {
        handler.successHandler = successCallback
    }
    if (typeof failCallback == 'function') {
        handler.failHandler = failCallback
    }
    this.queue.push(handler)
    return this
}

Promise.all = function (promiseArr) {
    var result = [], defer = new Defer(), isError = false;
    promiseArr.forEach(promise => {
        promise.then(function (data) {
            result.push(data)
            if (this.result.length == 3) {
                defer.resolve(result)
            }
        }, function (error) {
            if (isError) {
                return
            } else {
                defer.reject(error)
                isError = true
            }
        })
    })
    return defer.promise
}

function Defer () {
    this.status = 'pending'
    this.promise = new Promise()
}

Defer.prototype.resolve = function (data) {
    var currentHandler, handlerResult, me = this;
    me.status = 'success'
    while (currentHandler = me.promise.queue.shift()) {
        if (currentHandler.successHandler) {
            handlerResult = currentHandler(data)
            if (handlerResult.isPromise) {
                handlerResult.queue = me.promise.queue
                me.promise = handlerResult
                break
            }
            // 这里没有考虑return值向后传递的问题
        }
    }
}

Defer.prototype.reject = function () {...}