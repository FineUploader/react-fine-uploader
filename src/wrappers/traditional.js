import BaseWrapper from './base-wrapper'
import qq from 'fine-uploader/lib/core'
import { traditional as callbackNames } from './callback-names'

export default class FineUploaderTraditional extends BaseWrapper {
    constructor({ options }) {
        super({
            callbackNames,
            options,
            qq,
            type: 'traditional' 
        })
    }
}
