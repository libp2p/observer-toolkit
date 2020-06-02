import React from 'react'
import T from 'prop-types'
import { act, fireEvent } from '@testing-library/react'

import {
  renderWithTheme,
  getMockRuntime,
  getMockState,
  getMockEvent,
} from '@nearform/observer-testing'
import useDatastore from './useDatastore'

function TestOutput({ states = [], events = [], runtime, retentionPeriodMs }) {
  let output = ''
  if (states.length)
    output += `States: ${states.map(state => state.testOutput).join('')}; `
  if (events.length)
    output += `Events: ${events.map(event => event.testOutput).join('')}; `
  if (runtime)
    output += `Runtime: ${runtime.getPeerId ? runtime.getPeerId() : runtime}; `
  if (retentionPeriodMs) output += `retentionPeriodMs: ${retentionPeriodMs}; `

  return <div data-testid="output">{output}</div>
}
TestOutput.propTypes = {
  states: T.array.isRequired,
  events: T.array.isRequired,
  runtime: T.object,
  retentionPeriodMs: T.number,
}

function expectedOutput({ states, events, runtime, retentionPeriodMs }) {
  let output = ''
  if (states) output += `States: ${states}; `
  if (events) output += `Events: ${events}; `
  if (runtime) output += `Runtime: ${runtime}; `
  if (retentionPeriodMs) output += `retentionPeriodMs: ${retentionPeriodMs}; `
  return output
}

function getMockStateTimes(end, duration = 1) {
  return {
    start: end - duration,
    duration,
    end,
  }
}

describe('useDataStore hook adds, replaces and sorts data', () => {
  it('Can set states alone, correcting time order, leaving events and runtime', async () => {
    const TestComponent = () => {
      const { replaceData, updateData, events, runtime, states } = useDatastore(
        {
          initialRuntime: getMockRuntime({ peerId: 'x' }),
          initialEvents: [
            { testOutput: '1', time: 1 },
            { testOutput: '2', time: 2 },
            { testOutput: '3', time: 3 },
          ].map(getMockEvent),
        }
      )

      return (
        <div>
          <button
            data-testid="init"
            onClick={() =>
              updateData({
                states: [
                  { testOutput: 'b', ...getMockStateTimes(2) },
                  { testOutput: 'a', ...getMockStateTimes(1) },
                  { testOutput: 'e', ...getMockStateTimes(5) },
                ].map(getMockState),
              })
            }
          />
          <button
            data-testid="update"
            onClick={() =>
              updateData({
                states: [
                  { testOutput: 'd', ...getMockStateTimes(4) },
                  { testOutput: 'f', ...getMockStateTimes(6) },
                  { testOutput: 'c', ...getMockStateTimes(3) },
                  { testOutput: 'g', ...getMockStateTimes(7) },
                ].map(getMockState),
              })
            }
          />
          <button
            data-testid="replace"
            onClick={() =>
              replaceData({
                states: [
                  { testOutput: 'x', ...getMockStateTimes(3) },
                  { testOutput: 'z', ...getMockStateTimes(1) },
                  { testOutput: 'y', ...getMockStateTimes(2) },
                  { testOutput: 'v', ...getMockStateTimes(5) },
                ].map(getMockState),
              })
            }
          />
          <button
            data-testid="update-replaced"
            onClick={() =>
              updateData({
                states: [
                  { testOutput: 'u', ...getMockStateTimes(6) },
                  { testOutput: 'w', ...getMockStateTimes(4) },
                  { testOutput: 't', ...getMockStateTimes(7) },
                ].map(getMockState),
              })
            }
          />
          <TestOutput states={states} events={events} runtime={runtime} />
        </div>
      )
    }
    const { getByTestId } = renderWithTheme(<TestComponent />)
    const getOutput = () => getByTestId('output').textContent

    const events = '123'
    const runtime = 'x'
    expect(getOutput()).toEqual(expectedOutput({ states: '', events, runtime }))

    const button1 = getByTestId('init')
    await act(async () => {
      fireEvent.click(button1)
    })
    expect(getOutput()).toEqual(
      expectedOutput({ states: 'abe', events, runtime })
    )

    const button2 = getByTestId('update')
    await act(async () => {
      fireEvent.click(button2)
    })
    expect(getOutput()).toEqual(
      expectedOutput({ states: 'abcdefg', events, runtime })
    )

    const button3 = getByTestId('replace')
    await act(async () => {
      fireEvent.click(button3)
    })

    expect(getOutput()).toEqual(expectedOutput({ states: 'zyxv' }))

    const button4 = getByTestId('update-replaced')
    await act(async () => {
      fireEvent.click(button4)
    })
    expect(getOutput()).toEqual(expectedOutput({ states: 'zyxwvut' }))
  })

  it('Can set events alone, correcting time order, leaving state and runtime', async () => {
    const TestComponent = () => {
      const { replaceData, updateData, events, runtime, states } = useDatastore(
        {
          initialRuntime: getMockRuntime({ peerId: 'x' }),
          initialStates: [
            { testOutput: '1', ...getMockStateTimes(1) },
            { testOutput: '2', ...getMockStateTimes(2) },
            { testOutput: '3', ...getMockStateTimes(3) },
          ].map(getMockState),
        }
      )

      return (
        <div>
          <button
            data-testid="init"
            onClick={() =>
              updateData({
                events: [
                  { testOutput: 'b', time: 2 },
                  { testOutput: 'a', time: 1 },
                  { testOutput: 'e', time: 5 },
                ].map(getMockEvent),
              })
            }
          />
          <button
            data-testid="update"
            onClick={() =>
              updateData({
                events: [
                  { testOutput: 'd', time: 4 },
                  { testOutput: 'f', time: 6 },
                  { testOutput: 'c', time: 3 },
                  { testOutput: 'g', time: 7 },
                ].map(getMockEvent),
              })
            }
          />
          <button
            data-testid="replace"
            onClick={() =>
              replaceData({
                events: [
                  { testOutput: 'x', time: 3 },
                  { testOutput: 'z', time: 1 },
                  { testOutput: 'y', time: 2 },
                  { testOutput: 'v', time: 5 },
                ].map(getMockEvent),
              })
            }
          />
          <button
            data-testid="update-replaced"
            onClick={() =>
              updateData({
                events: [
                  { testOutput: 'u', time: 6 },
                  { testOutput: 'w', time: 4 },
                  { testOutput: 't', time: 7 },
                ].map(getMockEvent),
              })
            }
          />
          <TestOutput states={states} events={events} runtime={runtime} />
        </div>
      )
    }
    const { getByTestId } = renderWithTheme(<TestComponent />)
    const getOutput = () => getByTestId('output').textContent

    const states = '123'
    const runtime = 'x'
    expect(getOutput()).toEqual(expectedOutput({ events: '', states, runtime }))

    const button1 = getByTestId('init')
    await act(async () => {
      fireEvent.click(button1)
    })
    expect(getOutput()).toEqual(
      expectedOutput({ events: 'abe', states, runtime })
    )

    const button2 = getByTestId('update')
    await act(async () => {
      fireEvent.click(button2)
    })
    expect(getOutput()).toEqual(
      expectedOutput({ events: 'abcdefg', states, runtime })
    )

    const button3 = getByTestId('replace')
    await act(async () => {
      fireEvent.click(button3)
    })

    expect(getOutput()).toEqual(expectedOutput({ events: 'zyxv' }))

    const button4 = getByTestId('update-replaced')
    await act(async () => {
      fireEvent.click(button4)
    })
    expect(getOutput()).toEqual(expectedOutput({ events: 'zyxwvut' }))
  })

  it('Can set data types together, correcting time order', async () => {
    const TestComponent = () => {
      const { replaceData, updateData, events, runtime, states } = useDatastore(
        {
          initialRuntime: getMockRuntime({ peerId: 'x' }),
          initialEvents: [
            { testOutput: 'b', time: 2 },
            { testOutput: 'e', time: 5 },
            { testOutput: 'a', time: 1 },
          ].map(getMockEvent),
          initialStates: [
            { testOutput: 'b', ...getMockStateTimes(2) },
            { testOutput: 'e', ...getMockStateTimes(5) },
            { testOutput: 'a', ...getMockStateTimes(1) },
          ].map(getMockState),
        }
      )

      return (
        <div>
          <button
            data-testid="update"
            onClick={() =>
              updateData({
                events: [
                  { testOutput: 'd', time: 4 },
                  { testOutput: 'f', time: 6 },
                  { testOutput: 'c', time: 3 },
                  { testOutput: 'g', time: 7 },
                ].map(getMockEvent),
                states: [
                  { testOutput: 'd', ...getMockStateTimes(4) },
                  { testOutput: 'f', ...getMockStateTimes(6) },
                  { testOutput: 'c', ...getMockStateTimes(3) },
                  { testOutput: 'g', ...getMockStateTimes(7) },
                ].map(getMockState),
                runtime: getMockRuntime({ peerId: 'y' }),
              })
            }
          />
          <button
            data-testid="replace"
            onClick={() =>
              replaceData({
                events: [
                  { testOutput: 'x', time: 3 },
                  { testOutput: 'z', time: 1 },
                  { testOutput: 'y', time: 2 },
                  { testOutput: 'v', time: 5 },
                ].map(getMockEvent),
                states: [
                  { testOutput: 'x', ...getMockStateTimes(3) },
                  { testOutput: 'z', ...getMockStateTimes(1) },
                  { testOutput: 'y', ...getMockStateTimes(2) },
                  { testOutput: 'v', ...getMockStateTimes(5) },
                ].map(getMockState),
                runtime: getMockRuntime({ peerId: 'z' }),
              })
            }
          />
          <button
            data-testid="update-replaced"
            onClick={() =>
              updateData({
                events: [
                  { testOutput: 'u', time: 6 },
                  { testOutput: 'w', time: 4 },
                  { testOutput: 't', time: 7 },
                ].map(getMockEvent),
                states: [
                  { testOutput: 'u', ...getMockStateTimes(6) },
                  { testOutput: 'w', ...getMockStateTimes(4) },
                  { testOutput: 't', ...getMockStateTimes(7) },
                ].map(getMockState),
              })
            }
          />
          <TestOutput states={states} events={events} runtime={runtime} />
        </div>
      )
    }
    const { getByTestId } = renderWithTheme(<TestComponent />)
    const getOutput = () => getByTestId('output').textContent

    expect(getOutput()).toEqual(
      expectedOutput({ events: 'abe', states: 'abe', runtime: 'x' })
    )

    const button2 = getByTestId('update')
    await act(async () => {
      fireEvent.click(button2)
    })
    expect(getOutput()).toEqual(
      expectedOutput({ events: 'abcdefg', states: 'abcdefg', runtime: 'y' })
    )

    const button3 = getByTestId('replace')
    await act(async () => {
      fireEvent.click(button3)
    })
    expect(getOutput()).toEqual(
      expectedOutput({ events: 'zyxv', states: 'zyxv', runtime: 'z' })
    )

    const button4 = getByTestId('update-replaced')
    await act(async () => {
      fireEvent.click(button4)
    })
    expect(getOutput()).toEqual(
      expectedOutput({ events: 'zyxwvut', states: 'zyxwvut', runtime: 'z' })
    )
  })
})

describe('useDataStore hook respects retentionPeriodMs runtime setting', () => {
  it('Discards states and events older than threshold whenever new states are added', async () => {
    const retentionPeriodMs = 4

    const TestComponent = () => {
      const initialRuntime = getMockRuntime({ retentionPeriodMs })
      const initialEvents = [
        { testOutput: '1', time: 1 },
        { testOutput: '6', time: 6 },
        { testOutput: '3', time: 3 },
        { testOutput: '5', time: 5 },
        { testOutput: '4', time: 4 },
        { testOutput: '2', time: 2 },
      ].map(getMockEvent)
      const initialStates = [
        { testOutput: '3', ...getMockStateTimes(3) },
        { testOutput: '2', ...getMockStateTimes(2) },
        { testOutput: '4', ...getMockStateTimes(4) },
        { testOutput: '6', ...getMockStateTimes(6) },
        { testOutput: '5', ...getMockStateTimes(5) },
        { testOutput: '1', ...getMockStateTimes(1) },
      ].map(getMockState)

      const {
        removeData,
        replaceData,
        updateData,
        updateRuntime,
        events,
        runtime,
        states,
      } = useDatastore({
        initialRuntime,
        initialEvents,
        initialStates,
      })

      const button1Events = [
        { testOutput: '7', time: 7 },
        { testOutput: '9', time: 9 },
        { testOutput: '8', time: 8 },
      ].map(getMockEvent)

      const button1States = [
        { testOutput: '9', ...getMockStateTimes(9) },
        { testOutput: '7', ...getMockStateTimes(7) },
        { testOutput: '8', ...getMockStateTimes(8) },
      ].map(getMockState)

      return (
        <div>
          <button
            data-testid="update"
            onClick={() =>
              updateData({
                events: button1Events,
                states: button1States,
              })
            }
          />
          <button
            data-testid="replace"
            onClick={() =>
              replaceData({
                events: [
                  { testOutput: '12', time: 12 },
                  { testOutput: '14', time: 14 },
                  { testOutput: '16', time: 16 },
                  { testOutput: '18', time: 18 },
                  { testOutput: '20', time: 20 },
                ].map(getMockEvent),
                states: [
                  { testOutput: '12', ...getMockStateTimes(12) },
                  { testOutput: '14', ...getMockStateTimes(14) },
                  { testOutput: '16', ...getMockStateTimes(16) },
                  { testOutput: '18', ...getMockStateTimes(18) },
                  { testOutput: '20', ...getMockStateTimes(20) },
                ].map(getMockState),
                runtime: initialRuntime,
              })
            }
          />
          <button
            data-testid="update-replaced"
            onClick={() =>
              updateData({
                events: [
                  { testOutput: '22', time: 22 },
                  { testOutput: '24', time: 24 },
                ].map(getMockEvent),
                states: [
                  { testOutput: '22', ...getMockStateTimes(22) },
                  { testOutput: '24', ...getMockStateTimes(24) },
                ].map(getMockState),
              })
            }
          />
          <button data-testid="remove" onClick={() => removeData()} />
          <button
            data-testid="update-removed"
            onClick={() =>
              updateData({
                events: [...initialEvents, ...button1Events].map(getMockEvent),
                states: [...initialStates, ...button1States].map(getMockState),
              })
            }
          />
          <button
            data-testid="add-runtime"
            onClick={() => updateRuntime(initialRuntime)}
          />
          <TestOutput
            states={states}
            events={events}
            retentionPeriodMs={runtime ? runtime.getRetentionPeriodMs() : null}
          />
        </div>
      )
    }
    const { getByTestId, findByText } = renderWithTheme(<TestComponent />)
    const getOutput = () => getByTestId('output').textContent

    // Using findBy...() for output to wait for the useEffect to apply
    const output1 = await findByText(
      expectedOutput({
        events: '23456',
        states: '23456',
        retentionPeriodMs,
      }).trim()
    )
    expect(output1).toBeInTheDocument()

    const button1 = getByTestId('update')
    await act(async () => {
      fireEvent.click(button1)
    })
    const output2 = await findByText(
      expectedOutput({
        events: '56789',
        states: '56789',
        retentionPeriodMs,
      }).trim()
    )
    expect(output2).toBeInTheDocument()

    const button2 = getByTestId('replace')
    await act(async () => {
      fireEvent.click(button2)
    })
    const output3 = await findByText(
      expectedOutput({
        events: '161820',
        states: '161820',
        retentionPeriodMs,
      }).trim()
    )
    expect(output3).toBeInTheDocument()

    const button3 = getByTestId('update-replaced')
    await act(async () => {
      fireEvent.click(button3)
    })
    const output4 = await findByText(
      expectedOutput({
        events: '202224',
        states: '202224',
        retentionPeriodMs,
      }).trim()
    )
    expect(output4).toBeInTheDocument()

    const button4 = getByTestId('remove')
    await act(async () => {
      fireEvent.click(button4)
    })
    expect(getOutput()).toEqual('')

    const button5 = getByTestId('update-removed')
    await act(async () => {
      fireEvent.click(button5)
    })
    const output5 = await findByText(
      expectedOutput({
        events: '123456789',
        states: '123456789',
      }).trim()
    )
    expect(output5).toBeInTheDocument()

    // Simulate runtime message not being received until after states and events
    const button6 = getByTestId('add-runtime')
    await act(async () => {
      fireEvent.click(button6)
    })
    const output6 = await findByText(
      expectedOutput({
        events: '56789',
        states: '56789',
        retentionPeriodMs,
      }).trim()
    )
    expect(output6).toBeInTheDocument()
  })

  it('Discards states and events correctly if threshold is shortened', async () => {
    const TestComponent = () => {
      const {
        replaceData,
        updateRuntime,
        events,
        runtime,
        states,
      } = useDatastore({
        initialRuntime: getMockRuntime({ retentionPeriodMs: 10 }),
        initialEvents: [
          { testOutput: '1', time: 1 },
          { testOutput: '6', time: 6 },
          { testOutput: '3', time: 3 },
          { testOutput: '5', time: 5 },
          { testOutput: '4', time: 4 },
          { testOutput: '2', time: 2 },
        ].map(getMockEvent),
        initialStates: [
          { testOutput: '3', ...getMockStateTimes(3) },
          { testOutput: '2', ...getMockStateTimes(2) },
          { testOutput: '4', ...getMockStateTimes(4) },
          { testOutput: '6', ...getMockStateTimes(6) },
          { testOutput: '5', ...getMockStateTimes(5) },
          { testOutput: '1', ...getMockStateTimes(1) },
        ].map(getMockState),
      })
      return (
        <div>
          <button
            data-testid="update-runtime"
            onClick={() =>
              updateRuntime(getMockRuntime({ retentionPeriodMs: 4 }))
            }
          />
          <button
            data-testid="replace-all"
            onClick={() =>
              replaceData({
                events: [
                  { testOutput: '12', time: 12 },
                  { testOutput: '14', time: 14 },
                  { testOutput: '16', time: 16 },
                  { testOutput: '18', time: 18 },
                  { testOutput: '20', time: 20 },
                ].map(getMockEvent),
                states: [
                  { testOutput: '12', ...getMockStateTimes(12) },
                  { testOutput: '14', ...getMockStateTimes(14) },
                  { testOutput: '16', ...getMockStateTimes(16) },
                  { testOutput: '18', ...getMockStateTimes(18) },
                  { testOutput: '20', ...getMockStateTimes(20) },
                ].map(getMockState),
                runtime: getMockRuntime({ retentionPeriodMs: 7 }),
              })
            }
          />
          <TestOutput
            states={states}
            events={events}
            retentionPeriodMs={runtime ? runtime.getRetentionPeriodMs() : null}
          />
        </div>
      )
    }
    const { getByTestId } = renderWithTheme(<TestComponent />)
    const getOutput = () => getByTestId('output').textContent

    expect(getOutput()).toEqual(
      expectedOutput({
        events: '123456',
        states: '123456',
        retentionPeriodMs: 10,
      })
    )

    const button1 = getByTestId('update-runtime')
    await act(async () => {
      fireEvent.click(button1)
    })
    expect(getOutput()).toEqual(
      expectedOutput({ events: '23456', states: '23456', retentionPeriodMs: 4 })
    )

    const button2 = getByTestId('replace-all')
    await act(async () => {
      fireEvent.click(button2)
    })
    expect(getOutput()).toEqual(
      expectedOutput({
        events: '14161820',
        states: '14161820',
        retentionPeriodMs: 7,
      })
    )
  })
})
