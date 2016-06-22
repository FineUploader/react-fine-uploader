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
        const index = callbacks.get(this).indexOf(callback)
        if (index >= 0) {
            callbacks.get(this).splice(index, 1)
        }
    }
    
    get name() {
        return privateData.get(this).name
    }

    get proxyFunction() {
        return privateData.get(this).proxyFunction
    }

    remove(callback) {
        callbacks.get(this).push(callback)
    }
}

const getProxyFunction = ({ classContext, name }) => {
    return function() {
        const isThenable = thenableCallbackNames.indexOf(name) >= 0
        const originalCallbackArguments = arguments
        const registeredCallbacks = callbacks.get(classContext)
        let callbackReturnValue

        if (isThenable) {
            callbackReturnValue = Promise.all(
                registeredCallbacks.map(callback => {
                    const returnValue = callback.apply(classContext, originalCallbackArguments)

                    if (returnValue && returnValue.then) {
                        return returnValue
                    }
                    else if (returnValue === false) {
                        return Promise.reject()
                    }

                    return Promise.resolve()
                })
            ).then(results => results[results.length - 1])
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
