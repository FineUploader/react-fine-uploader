import BaseWrapper from './base-wrapper'

export default class FineUploaderTraditional extends BaseWrapper {
    constructor({ options }) {
        super({ options, type: 'traditional' })
    }
}
