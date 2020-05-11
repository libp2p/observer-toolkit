import React from 'react'
import T from 'prop-types'
import { act, fireEvent } from '@testing-library/react'

import {
  renderWithTheme,
  getMockRuntime,
  getMockState,
  getMockEvent,
} from '@libp2p-observer/testing'
import useDatastore from './useDatastore'

function TestOutput({ states, events, runtime }) {
  return (
    <div data-testid="output">
      {`States: ${states.map(state => state.testOutput).join('')}; `}
      {`Events: ${events.map(event => event.testOutput).join('')}; `}
      {`Runtime: ${runtime ? runtime.getPeerId() : 'none'};`}
    </div>
  )
}
TestOutput.propTypes = {
  states: T.array.isRequired,
  events: T.array.isRequired,
  runtime: T.object,
}

function expectedOutput({ states, events, runtime = 'none' }) {
  return `States: ${states}; Events: ${events}; Runtime: ${runtime};`
}

function getMockStateTimes(start, duration = 1000) {
  return {
    start,
    duration,
    end: start + duration,
  }
}

describe('useDataStore hook', () => {
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

    let events = '123'
    let runtime = 'x'
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

    events = ''
    runtime = 'none'
    expect(getOutput()).toEqual(
      expectedOutput({ states: 'zyxv', events, runtime })
    )

    const button4 = getByTestId('update-replaced')
    await act(async () => {
      fireEvent.click(button4)
    })
    expect(getOutput()).toEqual(
      expectedOutput({ states: 'zyxwvut', events, runtime })
    )
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

    let states = '123'
    let runtime = 'x'
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

    states = ''
    runtime = 'none'
    expect(getOutput()).toEqual(
      expectedOutput({ events: 'zyxv', states, runtime })
    )

    const button4 = getByTestId('update-replaced')
    await act(async () => {
      fireEvent.click(button4)
    })
    expect(getOutput()).toEqual(
      expectedOutput({ events: 'zyxwvut', states, runtime })
    )
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
