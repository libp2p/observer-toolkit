import React, { useContext } from 'react'
import T from 'prop-types'
import { fireEvent, act } from '@testing-library/react'
import waitForExpect from 'wait-for-expect'

import { SetterContext } from '@nearform/observer-sdk'

import {
  renderWithData,
  renderWithShell,
  loadSample,
  within,
} from '@nearform/observer-testing'

import SamplesList from './SamplesList'

function MockSamplesList({
  handleUploadStart = () => {},
  handleUploadFinished = () => {},
}) {
  const { updateData } = useContext(SetterContext)
  const handleUploadChunk = data => updateData(data)
  return (
    <SamplesList
      handleUploadChunk={handleUploadChunk}
      handleUploadStart={handleUploadStart}
      handleUploadFinished={handleUploadFinished}
    />
  )
}
MockSamplesList.propTypes = {
  handleUploadStart: T.func,
  handleUploadFinished: T.func,
}

describe('SamplesList', () => {
  it('renders as expected', () => {
    const { asFragment } = renderWithData(<MockSamplesList />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('loads sample datasets, updating shell content', async () => {
    const mockFn = jest.fn()

    const { findByText, getByText } = renderWithShell(
      <MockSamplesList handleUploadFinished={mockFn} />
    )
    const {
      data: { runtime },
    } = loadSample()
    const peerId = runtime.getPeerId()

    const getCurrentPeerId = async () => {
      const shellPeerIdButton = await findByText(/^peer id —/i)
      await act(async () => {
        await fireEvent.mouseEnter(shellPeerIdButton)
      })

      const tooltip = await within(shellPeerIdButton).findByRole('tooltip')
      const tooltipText = tooltip.textContent
      const button = within(tooltip).getByRole('button')
      const buttonText = button.textContent
      const currentPeerId = tooltipText.replace(buttonText, '')

      await act(async () => {
        await fireEvent.mouseLeave(shellPeerIdButton)
      })
      return currentPeerId
    }

    expect(await getCurrentPeerId()).toEqual(peerId)

    // Loading a different sample loads a different Peer ID
    const sample2MinButton = getByText('2 minutes')
    await act(async () => {
      await fireEvent.click(sample2MinButton)
      await waitForExpect(() => {
        expect(mockFn).toHaveBeenCalledTimes(1)
      })
    })
    expect(await getCurrentPeerId()).not.toEqual(peerId)

    // Loading the original sample loads the original Peer ID
    const sample1MinButton = getByText('1 minute')
    await act(async () => {
      await fireEvent.click(sample1MinButton)
      await waitForExpect(() => {
        expect(mockFn).toHaveBeenCalledTimes(2)
      })
    })
    expect(await getCurrentPeerId()).toEqual(peerId)
  })
})
