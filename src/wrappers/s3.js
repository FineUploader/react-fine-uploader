import BaseWrapper from './base-wrapper'

export default class FineUploaderS3 extends BaseWrapper {
    constructor({ options }) {
        super({ options, type: 's3' })
    }
}
