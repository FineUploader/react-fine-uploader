const privateData = new WeakMap()
const callbacks = new WeakMap()

export default class CallbackProxy {
    constructor(name) {
        callbacks.set(this, [])

        privateData.set(this, {
            name,
            proxyFunction: getProxyFunction({ classContext: this })
        })
    }

    get name() {
        return privateData.get(this).name
    }

    off(callback) {
        const index = callbacks.get(this).indexOf(callback)
        if (index >= 0) {
            callbacks.get(this).splice(index, 1)
        }
    }

    on(callback) {
        callbacks.get(this).push(callback)
    }

    get proxyFunction() {
        return privateData.get(this).proxyFunction
    }
}

const getProxyFunction = ({ classContext }) => {
    return function() {
        const originalCallbackArguments = arguments
        const registeredCallbacks = callbacks.get(classContext)

        // TODO handle return values (thenable & non-thenable)
        registeredCallbacks.forEach(function(callbacks) {
            callbacks.apply(classContext, originalCallbackArguments)
        })
    }
}
