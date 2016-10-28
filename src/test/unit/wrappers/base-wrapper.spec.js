import qq from 'fine-uploader/lib/core'

import FineUploaderTraditional from 'src/wrappers/traditional'

const sampleBlob = new Blob(['hi!'], { type : 'text/plain' })
const sampleBlobWrapper = { blob: sampleBlob, name: 'test' }

describe('Fine Uploader wrapper classes', () => {
    describe('new instance consruction', () => {
        it('provides access to its API', () => {
            const wrapper = new FineUploaderTraditional({
                options: {}
            })

            expect(wrapper.methods).toBeTruthy()
            expect(wrapper.methods.getFile).toBeTruthy()
            expect(wrapper.methods.addFiles).toBeTruthy()
        })

        it('provides access to passed options', () => {
            const wrapper = new FineUploaderTraditional({
                options: {
                    request: {
                        endpoint: 'foo/bar'
                    },
                    callbacks: {}
                }
            })

            expect(wrapper.options).toBeTruthy()
            expect(wrapper.options).toEqual({
                request: {
                    endpoint: 'foo/bar'
                }
            })
        })

        it('associates passed callbacks with underlying uploader instance', done => {
            const wrapper = new FineUploaderTraditional({
                options: {
                    autoUpload: false,
                    callbacks: {
                        onSubmit: function(id, name) {
                            expect(id).toBe(0)
                            expect(name).toBe(sampleBlobWrapper.name)

                            done()
                        }
                    }
                }
            })

            wrapper.methods.addFiles(sampleBlobWrapper)
        })
    })

    describe('callback handling', () => {
        it('associates multiple registered callback handlers w/ a single FU callback option && calls them in the order they were registered', done => {
            let callbacksHit = 0

            const wrapper = new FineUploaderTraditional({
                options: {
                    autoUpload: false,
                    callbacks: {
                        onSubmit: function(id, name) {
                            callbacksHit++
                            expect(id).toBe(0)
                            expect(name).toBe(sampleBlobWrapper.name)
                        }
                    }
                }
            })

            wrapper.on('submit', (id, name) => {
                const records = wrapper.methods.getUploads()
                expect(records.length).toBe(1)
                expect(records[0].status).toBe(qq.status.SUBMITTING)

                expect(++callbacksHit).toBe(2)
                expect(id).toBe(0)
                expect(name).toBe(sampleBlobWrapper.name)
            })

            setTimeout(() => {
                const records = wrapper.methods.getUploads()
                expect(records[0].status).toBe(qq.status.SUBMITTED)

                done()
            }, 100)

            wrapper.methods.addFiles(sampleBlobWrapper)
        })

        it('does not call subsequent registered non-thenable callbacks if an earlier callback indicates failure w/ `false`', done => {
            let callbacksHit = 0

            const wrapper = new FineUploaderTraditional({
                options: {
                    autoUpload: false,
                    callbacks: {
                        onSubmitted: function(id, name) {
                            callbacksHit++
                            expect(id).toBe(0)
                            expect(name).toBe(sampleBlobWrapper.name)
                            return false
                        }
                    }
                }
            })

            // this callback should never be executed
            wrapper.on('submitted', () => {
                callbacksHit++
            })

            wrapper.methods.addFiles(sampleBlobWrapper)

            setTimeout(() => {
                expect(callbacksHit).toBe(1)

                done()
            }, 100)
        })

        it('does not call subsequent registered thenable callbacks if an earlier callback indicates failure w/ a Promise', done => {
            let callbacksHit = 0

            const wrapper = new FineUploaderTraditional({
                options: {
                    autoUpload: false,
                    callbacks: {
                        onSubmit: function(id, name) {
                            callbacksHit++
                            expect(id).toBe(0)
                            expect(name).toBe(sampleBlobWrapper.name)
                            return false
                        }
                    }
                }
            })

            // this callback should never be executed
            wrapper.on('submit', () => {
                callbacksHit++
            })

            wrapper.methods.addFiles(sampleBlobWrapper)

            setTimeout(() => {
                const records = wrapper.methods.getUploads()
                expect(records.length).toBe(1)
                expect(records[0].status).toBe(qq.status.REJECTED)

                expect(callbacksHit).toBe(1)

                done()
            }, 100)
        })

        it('does not call subsequent registered thenable callbacks if an earlier callback indicates failure w/ `false`', done => {
            let callbacksHit = 0

            const wrapper = new FineUploaderTraditional({
                options: {
                    autoUpload: false,
                    callbacks: {
                        onSubmit: function(id, name) {
                            callbacksHit++
                            expect(id).toBe(0)
                            expect(name).toBe(sampleBlobWrapper.name)
                            return Promise.reject()
                        }
                    }
                }
            })

            // this callback should never be executed
            wrapper.on('submit', () => {
                callbacksHit++
            })

            wrapper.methods.addFiles(sampleBlobWrapper)

            setTimeout(() => {
                const records = wrapper.methods.getUploads()
                expect(records.length).toBe(1)
                expect(records[0].status).toBe(qq.status.REJECTED)

                expect(callbacksHit).toBe(1)

                done()
            }, 100)
        })

        it('allows callback handlers to be removed', done => {
            const handler = () => callbacksHit++
            let callbacksHit = 0

            const wrapper = new FineUploaderTraditional({
                options: { autoUpload: false }
            })

            wrapper.on('submit', handler)
            wrapper.methods.addFiles(sampleBlobWrapper)

            setTimeout(() => {
                expect(callbacksHit).toBe(1)

                wrapper.off('submit', handler)
                wrapper.methods.addFiles(sampleBlobWrapper)

                setTimeout(() => {
                    expect(callbacksHit).toBe(1)

                    done()
                }, 100)
            }, 100)
        })
    })
})
