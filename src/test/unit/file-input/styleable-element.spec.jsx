import React from 'react'
import TestUtils from 'react-addons-test-utils'

import { wrapStatelessComponent } from 'test/utils'
import StyleableElement from 'src/file-input/styleable-element'

describe('<StylableElement />', () => {
    const WrappedStyleableElement = wrapStatelessComponent(StyleableElement)

    it('renders the underlying input type="file" element', () => {
        const StyleableElementComponent =
            TestUtils.renderIntoDocument(<WrappedStyleableElement>click me</WrappedStyleableElement>)

        expect(TestUtils.findRenderedDOMComponentWithTag(StyleableElementComponent, 'input'))
            .toBeTruthy()
    })

    it('passes standard attributes to the underlying file input', () => {
        const StyleableElementComponent =
            TestUtils.renderIntoDocument(
                <WrappedStyleableElement multiple name='test'>
                    click me
                </WrappedStyleableElement>
            )

        const fileInput = TestUtils.findRenderedDOMComponentWithTag(StyleableElementComponent, 'input')
        expect(fileInput.hasAttribute('multiple')).toBeTruthy()
        expect(fileInput.getAttribute('name')).toBe('test')
    })
})
