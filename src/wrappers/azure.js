import BaseWrapper from './base-wrapper'
import qq from 'fine-uploader/lib/core/azure'
import { traditional as callbackNames } from './callback-names'

export default class FineUploaderAzure extends BaseWrapper {
    constructor({ options }) {
        super({
            callbackNames,
            options,
            qq,
            type: 'azure'
        })
    }
}
