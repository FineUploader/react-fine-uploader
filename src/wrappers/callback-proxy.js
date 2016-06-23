import objectAssign from 'object-assign'

import { thenable as thenableCallbackNames } from './callback-names'

const privateData = new WeakMap()
const callbacks = new WeakMap()

export default class CallbackProxy {
    constructor(name) {
        callbacks.set(this, [])

        privateData.set(this, {
            name,
            proxyFunction: getProxyFunction({ classContext: this, name })
        })
    }

    add(callback) {
        callbacks.get(this).push(callback)
    }
    
    get name() {
        return privateData.get(this).name
    }

    get proxyFunction() {
        return privateData.get(this).proxyFunction
    }

    remove(callback) {
        const index = callbacks.get(this).indexOf(callback)
        if (index >= 0) {
            callbacks.get(this).splice(index, 1)
        }
    }
}

const getProxyFunction = ({ classContext, name }) => {
    return function() {
        const isThenable = thenableCallbackNames.indexOf(name) >= 0
        const originalCallbackArguments = arguments
        const registeredCallbacks = callbacks.get(classContext)
        let callbackReturnValue

        if (isThenable) {
            callbackReturnValue = executeThenableCallbacks(classContext, registeredCallbacks, originalCallbackArguments)
        }
        else {
            registeredCallbacks.every(callback => {
                const returnValue = callback.apply(classContext, originalCallbackArguments)

                callbackReturnValue = returnValue

                return returnValue !== false
            })
        }

        return callbackReturnValue
    }
}

const executeThenableCallbacks = (callbackContext, callbacks, originalCallbackArguments) => {
    if (callbacks.length) {
        return executeThenableCallback(callbackContext, objectAssign([], callbacks).reverse(), originalCallbackArguments)
    }

    return Promise.resolve()
}

const executeThenableCallback = (callbackContext, callbacks, originalCallbackArguments) => {
    return new Promise((resolve, reject) => {
        const callback = callbacks.pop()

        let returnValue = callback.apply(callbackContext, originalCallbackArguments)

        if (returnValue && returnValue.then) {
            returnValue
                .then(result => {
                    if (callbacks.length) {
                        executeThenableCallback(callbackContext, callbacks, originalCallbackArguments)
                            .then(resolve, reject)
                    }
                    else {
                        resolve(result)
                    }
                })
                .catch(error => {
                    reject(error)
                })
        }
        else if (returnValue === false) {
            reject()
        }
        else {
            if (callbacks.length) {
                executeThenableCallback(callbackContext, callbacks, originalCallbackArguments)
                    .then(resolve, reject)
            }
            else {
                resolve()
            }
        }
    })
}
