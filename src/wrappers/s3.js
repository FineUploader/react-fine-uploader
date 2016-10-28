import BaseWrapper from './base-wrapper'
import qq from 'fine-uploader/lib/core/s3'
import { s3 as callbackNames } from './callback-names'

export default class FineUploaderS3 extends BaseWrapper {
    constructor({ options }) {
        super({
            callbackNames,
            options,
            qq,
            type: 's3' 
        })
    }
}
