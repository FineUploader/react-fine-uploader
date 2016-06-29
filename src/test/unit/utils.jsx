import React from 'react'

export const wrapStatelessComponent = StatelessComponent => (
    class Wrapper extends React.Component {
        render() {
            return StatelessComponent(this.props)
        }
    }
)
