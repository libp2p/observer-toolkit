import React from 'react'
import T from 'prop-types'

function SelectedComponent({ viz: { Component } }) {
  // Wrap dynamically-selected function component in static
  // function component so there's a stable base for react hooks
  return <Component />
}

SelectedComponent.propTypes = {
  viz: T.shape({
    Component: T.elementType,
  }),
}

export default SelectedComponent
