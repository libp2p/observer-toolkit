import React from 'react'
import { fireEvent } from '@testing-library/react'

import { renderWithTheme } from '@libp2p-observer/testing'

import CatalogueItem from './CatalogueItem'

const mockWidget = {
  name: 'Mock widget',
  description: 'Mock widget description',
  tags: ['Tag', 'Another tag'],
  screenshot: 'mock.png',
}

const mockMarkdown = `
  This description has section headings, bullets, a link and an image.

  ### Section 1

  An example [link](http://example.com/)

  ### Section 2

  An example image: ![test alt text](${mockWidget.screenshot})
`

describe('CatalogueItem', () => {
  it('renders as expected', () => {
    const { asFragment } = renderWithTheme(<CatalogueItem {...mockWidget} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('can be selected by mouse and keyboard', async () => {
    const mockFn = jest.fn()
    const { getByText } = renderWithTheme(
      <CatalogueItem handleSelect={mockFn} {...mockWidget} />
    )

    const item = getByText('Mock widget')

    await fireEvent.keyPress(item, { key: 'Enter', keyCode: 13 })
    expect(mockFn).toHaveBeenCalledTimes(1)

    await fireEvent.click(item)
    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('renders markdown correctly', () => {
    const describedWidget = Object.assign({}, mockWidget, {
      description: mockMarkdown,
    })

    const { getAllByRole, getByAltText, getByText } = renderWithTheme(
      <CatalogueItem {...describedWidget} />
    )

    const headings = getAllByRole('heading')
    const expectedHeadings = ['Mock widget', 'Section 1', 'Section 2']
    const headingTexts = headings.map(head => head.textContent)
    expect(headings).toHaveLength(expectedHeadings.length)

    expect(headingTexts).toEqual(expectedHeadings)

    const link = getByText('link')
    expect(link.href).toBe('http://example.com/')

    expect(getByAltText('test alt text')).toBeInTheDocument()
  })
})
