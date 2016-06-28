import objectAssign from 'object-assign'

import { thenable as thenableCallbackNames } from './callback-names'

const privateData = new WeakMap()
const callbacks = new WeakMap()

export default class CallbackProxy {
    constructor(name) {
        callbacks.set(this, [])

        privateData.set(this, {
            name,
            proxyFunction: getProxyFunction.call(this, { name })
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

const getProxyFunction = function({ name }) {
    const proxyClassContext = this
    
    return (...originalCallbackArguments) => {
        const isThenable = thenableCallbackNames.indexOf(name) >= 0
        const registeredCallbacks = callbacks.get(proxyClassContext)
        let callbackReturnValue

        if (isThenable) {
            callbackReturnValue = executeThenableCallbacks({ registeredCallbacks, originalCallbackArguments })
        }
        else {
            registeredCallbacks.every(callback => {
                const returnValue = callback.apply(null, originalCallbackArguments)

                callbackReturnValue = returnValue

                return returnValue !== false
            })
        }

        return callbackReturnValue
    }
}

const executeThenableCallbacks = ({ registeredCallbacks, originalCallbackArguments }) => {
    if (registeredCallbacks.length) {
        return executeThenableCallback({
            registeredCallbacks: objectAssign([], registeredCallbacks).reverse(),
            originalCallbackArguments
        })
    }

    return Promise.resolve()
}

const executeThenableCallback = ({ registeredCallbacks, originalCallbackArguments} ) => {
    return new Promise((resolve, reject) => {
        const callback = registeredCallbacks.pop()

        let returnValue = callback.apply(null, originalCallbackArguments)

        if (returnValue && returnValue.then) {
            returnValue
                .then(result => {
                    if (registeredCallbacks.length) {
                        executeThenableCallback({ registeredCallbacks, originalCallbackArguments })
                            .then(resolve, reject)
                    }
                    else {
                        resolve(result)
                    }
                })
                .catch(error => reject(error))
        }
        else if (returnValue === false) {
            reject()
        }
        else {
            if (registeredCallbacks.length) {
                executeThenableCallback({ registeredCallbacks, originalCallbackArguments })
                    .then(resolve, reject)
            }
            else {
                resolve()
            }
        }
    })
}
