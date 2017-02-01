import React from 'react'
import TestUtils from 'react-addons-test-utils'

import DeleteButton from 'src/delete-button'
import FineUploaderTraditional from 'fine-uploader-wrappers'

describe('<DeleteButton />', () => {
    const getButton = Component => (
        TestUtils.scryRenderedDOMComponentsWithClass(Component, 'react-fine-uploader-delete-button')[0]
    )
    let uploader, statusChangeCallback

    beforeEach(() => {
        uploader = new FineUploaderTraditional({ options: {} })

        spyOn(uploader, 'on').and.callFake((type, callback) => {
            if (type === 'statusChange') {
                statusChangeCallback = callback
            }
        })
    })

    it('renders the button for a successfully uploaded file w/ default content', () => {
        const DeleteButtonComponent = TestUtils.renderIntoDocument(
            <DeleteButton id={ 0 } uploader={ uploader } />
        )

        statusChangeCallback(0, null, 'upload successful')

        const button = getButton(DeleteButtonComponent)
        expect(button.disabled).toBeFalsy()
        expect(button.textContent).toBe('Delete')
    })

    it('renders the button for a successfully uploaded file w/ custom content', () => {
        const DeleteButtonComponent = TestUtils.renderIntoDocument(
            <DeleteButton id={ 0 } uploader={ uploader }>
                Delete me
            </DeleteButton>
        )

        statusChangeCallback(0, null, 'upload successful')

        const button = getButton(DeleteButtonComponent)
        expect(button.disabled).toBeFalsy()
        expect(button.textContent).toBe('Delete me')
    })

    it('allows custom attributes to be attached to the button', () => {
        const DeleteButtonComponent = TestUtils.renderIntoDocument(
            <DeleteButton data-foo='bar' id={ 0 } uploader={ uploader } />
        )

        statusChangeCallback(0, null, 'upload successful')

        const button = getButton(DeleteButtonComponent)
        expect(button.getAttribute('data-foo')).toBe('bar')
    })

    it('deletes the file if clicked', () => {
        const deleteFileMethod = spyOn(uploader.methods, 'deleteFile')
        const DeleteButtonComponent = TestUtils.renderIntoDocument(
            <DeleteButton data-foo='bar' id={ 0 } uploader={ uploader } />
        )

        statusChangeCallback(0, null, 'upload successful')

        const button = getButton(DeleteButtonComponent)
        TestUtils.Simulate.click(button)
        expect(deleteFileMethod).toHaveBeenCalled()
    })

    it('removes the button by default if the file can no longer be deleted', () => {
        const DeleteButtonComponent = TestUtils.renderIntoDocument(
            <DeleteButton data-foo='bar' id={ 0 } uploader={ uploader } />
        )

        statusChangeCallback(0, null, 'deleted')

        const button = getButton(DeleteButtonComponent)
        expect(button).toBeFalsy()
    })

    it('disabled the button while the delete is in progress', () => {
        const DeleteButtonComponent = TestUtils.renderIntoDocument(
            <DeleteButton data-foo='bar' id={ 0 } uploader={ uploader } />
        )

        statusChangeCallback(0, null, 'deleting')

        const button = getButton(DeleteButtonComponent)
        expect(button.disabled).toBe(true)
    })

    it('disables the button if requested when the file can no longer be deleted', () => {
        const DeleteButtonComponent = TestUtils.renderIntoDocument(
            <DeleteButton data-foo='bar' id={ 0 } onlyRenderIfDeletable={ false } uploader={ uploader } />
        )

        statusChangeCallback(0, null, 'deleted')

        const button = getButton(DeleteButtonComponent)
        expect(button).toBeTruthy()
        expect(button.disabled).toBe(true)
    })
})
