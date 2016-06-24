import objectAssign from 'object-assign'
import qq from 'fine-uploader'

import CallbackProxy from './callback-proxy'
import { traditional as callbackNames } from './callback-names'

const callbackProxies = new WeakMap()

export default class FineUploaderTraditional {
    constructor({ options }) {
        const callbacks = options.callbacks || {}

        const optionsSansCallbacks = Object.assign({}, options)
        delete optionsSansCallbacks.callbacks
        this.options = optionsSansCallbacks

        callbackProxies.set(this, createCallbackProxies(callbackNames))
        
        registerOptionsCallbacks({ callbacks, callbackProxies: callbackProxies.get(this) })

        this.methods = createFineUploader({
            callbackProxies: callbackProxies.get(this),
            options: optionsSansCallbacks 
        })
    }

    off(name, callback) {
        const normalizedName = normalizeCallbackName(name)
        const proxy = callbackProxies.get(this)[normalizedName]

        proxy.remove(callback)
    }

    on(name, callback) {
        const normalizedName = normalizeCallbackName(name)
        const proxy = callbackProxies.get(this)[normalizedName]

        proxy.add(callback)
    }
}

const createCallbackProxies = names => {
    const proxyMap = {}
    
    names.forEach(callbackName => {
        proxyMap[callbackName] = new CallbackProxy(callbackName)
    })
    
    return proxyMap
}

const createFineUploader = ({ callbackProxies, options} ) => {
    const optionsCopy = objectAssign({ callbacks: {} }, options)

    Object.keys(callbackProxies).forEach(callbackName => {
        const proxy = callbackProxies[callbackName]
        
        optionsCopy.callbacks[callbackName] = proxy.proxyFunction
    })
    
    return new qq.FineUploaderBasic(optionsCopy)
}

const normalizeCallbackName = name => {
    if (!name.match(/^on[A-Z]/)) {
        return `on${name[0].toUpperCase()}${name.slice(1)}`
    }

    return name
}

const registerOptionsCallbacks = ({ callbacks, callbackProxies }) => {
    Object.keys(callbacks).forEach(callbackName => {
        const callbackProxy = callbackProxies[callbackName]

        callbackProxy.add(callbacks[callbackName])
    })
}
