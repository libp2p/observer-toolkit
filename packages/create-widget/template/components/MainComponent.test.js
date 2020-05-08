import React from 'react'
import {
  loadSample,
  nudgeTimelineSlider,
  renderWithShell,
  within,
} from '@libp2p/observer-testing'
import $WIDGET_COMPONENT from './$WIDGET_COMPONENT'

// Uses Jest and React Testing Library, with custom queries,
// loaders and helpers in @libp2p/observer-testing

describe('$WIDGET_COMPONENT', () => {
  // Example showing how to test a widget's interaction with
  // the libp2p-observer shell, and check content matches data

  const {
    data: { states },
  } = loadSample()
  const statesCount = states.length

  it('displays text corresponding to states and current index', async () => {
    const { getByRole, getByTestId } = renderWithShell(<$WIDGET_COMPONENT />)

    const getTextMatcher = stateIndex =>
      new RegExp(`message ${stateIndex} of ${statesCount}`, 'i')

    const article = getByRole('article')
    const text = within(article).getByText(getTextMatcher(statesCount))

    expect(article).toBeInTheDocument()
    expect(text).toBeInTheDocument()

    await nudgeTimelineSlider('left', getByTestId)

    expect(article).not.toBeInTheDocument()
    expect(text).not.toBeInTheDocument()

    const newArticle = getByRole('article')
    const newText = within(newArticle).getByText(
      getTextMatcher(statesCount - 1)
    )

    expect(newArticle).toBeInTheDocument()
    expect(newText).toBeInTheDocument()
  })
})
