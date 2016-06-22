// TODO import Object.assign helper for IE

import qq from 'fine-uploader'

import CallbackProxy from './callback-proxy'

// TODO
const callbackNames = [
    ''
]

export default class FineUploaderTraditional {
    constructor({ options }) {
        const callbacks = options.callbacks
        const callbackProxies = createCallbackProxies(callbackNames)
        const optionsSansCallbacks = Object.assign({}, options)

        delete optionsSansCallbacks.callbacks

        registerOptionsCallbacks({ callbacks, callbacksKey: this })

        this.methods = createFineUploader({
            callbackProxies,
            options: optionsSansCallbacks 
        })
    }

    off({ callback, name }) {
        // TODO
    }

    on({ callback, name }) {
        // TODO
    }
}

const createCallbackProxies = names => {
    names.map(callbackName => new CallbackProxy(callbackName))
}

const createFineUploader = ({ callbackProxies, options} ) => {
    const optionsCopy = Object.assign({}, options)
    optionsCopy.callbacks = callbackProxies.map(callbackProxy => {
        return {
            [callbackProxy.name]: callbackProxy.proxyFunction
        }
    })

    return new qq.FineUploaderBasic(optionsCopy)
}

const registerOptionsCallbacks = ({ callbacks, callbacksKey }) => {
    // TODO
}
