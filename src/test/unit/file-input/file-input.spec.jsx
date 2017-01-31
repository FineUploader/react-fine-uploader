import React from 'react'
import TestUtils from 'react-addons-test-utils'

import FileInput from 'src/file-input'

class DummyStylableElement extends React.Component {
    render() {
        return <div className='file-input'
                    onChange={ this.props.onChange }
        />
    }
}

describe('<FileInput />', () => {
    beforeEach(() => {
        FileInput.__Rewire__('StyleableElement', DummyStylableElement)
    })

    afterEach(() => {
        FileInput.__ResetDependency__('StyleableInput')
    })

    it('adds files to Fine Uploader when files are selected', () => {
        const addFiles = jasmine.createSpy('addFiles')
        const uploader = {
            methods: { addFiles }
        }
        const FileInputComponent =
            TestUtils.renderIntoDocument(<FileInput uploader={ uploader }>click me</FileInput>)
        const fileInputElement = TestUtils.findRenderedDOMComponentWithClass(FileInputComponent, 'file-input')

        TestUtils.Simulate.change(fileInputElement)
        expect(addFiles).toHaveBeenCalled()
    })
})
