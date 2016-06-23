import FineUploaderTraditional from 'src/wrappers/traditional'

const sampleBlob = new Blob(['hi!'], { type : 'text/plain' })
const sampleBlobWrapper = { blob: sampleBlob, name: 'test' }

describe('FineUploaderTraditional', () => {
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

        it('associates passed callbacks with underlying uploader instance', (done) => {
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
        it('associates multiple registered callback handlers w/ a single FU callback option && calls them in the order they were registered', (done) => {
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

            wrapper.on('onSubmit', (id, name) => {
                expect(++callbacksHit).toBe(2)
                expect(id).toBe(0)
                expect(name).toBe(sampleBlobWrapper.name)
                done()
            })

            wrapper.methods.addFiles(sampleBlobWrapper)
        })

        it('does not call subsequent registered callbacks if an earlier callback indicates failure - non-thenable', (done) => {
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
            wrapper.on('onSubmit', () => {
                callbacksHit++
            })

            wrapper.methods.addFiles(sampleBlobWrapper)

            setTimeout(() => {
                expect(callbacksHit).toBe(1)
                done()
            }, 500)
        })

        it('does not call subsequent registered callbacks if an earlier callback indicates failure - thenable', (done) => {
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
            wrapper.on('onSubmit', () => {
                callbacksHit++
            })

            wrapper.methods.addFiles(sampleBlobWrapper)

            setTimeout(() => {
                expect(callbacksHit).toBe(1)
                done()
            }, 500)
        })
    })
})
