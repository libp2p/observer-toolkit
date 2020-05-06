import { act, fireEvent } from '@testing-library/react'

const keys = {
  left: { key: 'ArrowLeft', keyCode: 37 },
  right: { key: 'ArrowRight', keyCode: 39 },
}

async function nudgeTimelineSlider(direction, getByTestId) {
  const key = keys[direction]
  if (!key) {
    throw new Error(
      `Can't nudge timeline "${direction}", only "${Object.keys(keys).join(
        '", "'
      )}"`
    )
  }
  const timelineSlider = getByTestId('timeline-slider')

  // Get the timeline slider in focus
  await fireEvent.click(timelineSlider)

  // Select previous state using left arrow keyboard shortcut
  await act(async () => {
    await fireEvent.keyDown(timelineSlider, key)
  })
}

export default nudgeTimelineSlider
