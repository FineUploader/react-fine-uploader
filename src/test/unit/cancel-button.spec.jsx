import React from 'react'
import TestUtils from 'react-addons-test-utils'

import FineUploaderTraditional from 'fine-uploader-wrappers'
import CancelButton from 'src/cancel-button'

const sampleBlob = new Blob(['hi!'], { type : 'text/plain' })

describe('<CancelButton />', () => {
    let button, CancelButtonComponent, uploader

    beforeEach(done => {
        uploader = new FineUploaderTraditional({options: { autoUpload: false }})

        uploader.on('submitted', done)

        uploader.methods.addFiles(sampleBlob)

        CancelButtonComponent = TestUtils.renderIntoDocument(
            <CancelButton id={ 0 } uploader={ uploader } />
        )

        button = TestUtils.findRenderedDOMComponentWithClass(CancelButtonComponent, 'react-fine-uploader-cancel-button')
    })

    it('renders the button for a submitted file w/ default content', () => {
        expect(button.disabled).toBeFalsy()
        expect(button.textContent).toBe('Cancel')
    })

    it('renders the button for a submitted file w/ custom content', () => {
        const CancelButtonComponent = TestUtils.renderIntoDocument(
            <CancelButton id={ 0 } uploader={ uploader }>foo</CancelButton>
        )

        button = TestUtils.findRenderedDOMComponentWithClass(CancelButtonComponent, 'react-fine-uploader-cancel-button')
        expect(button.textContent).toBe('foo')
    })

    it('allows custom attributes to be attached to the button', () => {
        const CancelButtonComponent = TestUtils.renderIntoDocument(
            <CancelButton id={ 0 } uploader={ uploader } data-foo='bar' />
        )

        button = TestUtils.findRenderedDOMComponentWithClass(CancelButtonComponent, 'react-fine-uploader-cancel-button')
        expect(button.getAttribute('data-foo')).toBe('bar')
    })

    it('cancels the upload if clicked', done => {
        uploader.on('statusChange', (id, oldStatus, newStatus) => {
            if (id === 0 && newStatus === 'canceled') {
                expect(uploader.methods.getUploads()[0].status).toBe('canceled')
                done()
            }
        })

        TestUtils.Simulate.click(button)
    })

    it('removes the button by default if the file can no longer be canceled', done => {
        uploader.on('statusChange', (id, oldStatus, newStatus) => {
            if (id === 0 && newStatus === 'canceled') {
                const buttons = TestUtils.scryRenderedDOMComponentsWithClass(CancelButtonComponent, 'react-fine-uploader-cancel-button')
                expect(buttons.length).toBe(0)
                done()
            }
        })

        uploader.methods.cancel(0)
    })

    it('disables the button if requested when the file can no longer be canceled', done => {
        uploader.on('statusChange', (id, oldStatus, newStatus) => {
            if (id === 0 && newStatus === 'canceled') {
                setTimeout(() => {
                    const buttons = TestUtils.scryRenderedDOMComponentsWithClass(CancelButtonComponent, 'react-fine-uploader-cancel-button')
                    expect(buttons.length).toBe(1)
                    expect(buttons[0].disabled).toBe(true)
                    done()
                })
            }
        })

        CancelButtonComponent = TestUtils.renderIntoDocument(
            <CancelButton id={ 0 } onlyRenderIfCancelable={ false } uploader={ uploader } />
        )

        uploader.methods.cancel(0)
    })
})
