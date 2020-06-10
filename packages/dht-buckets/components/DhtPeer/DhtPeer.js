import React, { useContext, useRef, useEffect } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { getKademliaDistance } from '@nearform/observer-data'
import {
  ConfigContext,
  RuntimeContext,
  SetterContext,
} from '@nearform/observer-sdk'

import DhtPeerHighlighting from './DhtPeerHighlighting'
import DhtPeerGlow from './DhtPeerGlow'
import {
  getAbsolutePosition,
  diffAbsolutePositions,
  getTranslateString,
} from '../../utils/positioning'

import { cutoff, outerSize, innerSize, gutterSize } from '../../utils/constants'

const Container = styled.div.attrs(({ age, theme }) => {
  const offset = Math.sqrt(age) / 70
  const opacity = Math.min(0.4, Math.sqrt(age) / (cutoff * 0.1)) + 0.6
  return {
    style: {
      top: `-${offset}px`,
      left: `-${offset}px`,
      boxShadow: `${offset}px ${offset}px 1px 1px ${theme.color(
        'contrast',
        0,
        opacity
      )}`,
    },
  }
})`
  position: relative;
  width: ${outerSize}px;
  height: ${outerSize}px;
  margin-top: ${gutterSize}px;
  margin-left: ${gutterSize}px;
`

const InnerChip = styled.div.attrs(({ theme, age }) => {
  const opacity = Math.min(0.5, Math.sqrt(age) / (cutoff * 0.1))
  const color = theme.color('background', 0, opacity)
  return {
    style: {
      borderTopColor: color,
      borderLeftColor: color,
    },
  }
})`
  position: absolute;
  width: ${innerSize}px;
  height: ${innerSize}px;
  top: ${gutterSize}px;
  left: ${gutterSize}px;
  border-width: ${gutterSize}px;
  border-style: solid;
  border-color: transparent;
  border-color: transparent;
  background: ${({ theme, status }) =>
    status === 'ACTIVE'
      ? theme.color('contrast', 2)
      : theme.color('background', 2, 0.25)};
  ${({ theme, noTransition }) => (noTransition ? '' : theme.transition())}
`

const Distance = styled.div`
  position: absolute;
  top: 6px;
  left: 0;
  width: ${outerSize}px;
  height: ${outerSize}px;
  color: ${({ theme }) => theme.color('contrast', 0, 0.9)};
  ${({ theme }) => theme.text('label', 'small')};
  text-align: center;
  font-weight: bold;
  z-index: 5;
  letter-spacing: -0.05em; // Ensure 3-digit numbers fit
`

function getTransitionStyles(slotRef, previousSlotRef) {
  const appear = [
    {
      transition: 'none',
      opacity: 0,
    },
    {
      transition: '300ms opacity ease-in',
      opacity: 1,
    },
  ]
  if (!previousSlotRef) return appear

  const noop = [
    {
      transition: 'none',
      transform: 'none',
    },
  ]
  const newSlot = slotRef.current
  const oldSlot = previousSlotRef.current

  if (!newSlot || !oldSlot || newSlot === oldSlot) return noop

  const oldPos = getAbsolutePosition(oldSlot)
  const newPos = getAbsolutePosition(newSlot)
  const diffPos = diffAbsolutePositions(oldPos, newPos)
  return [
    {
      transform: getTranslateString(diffPos),
      transition: 'none',
    },
    {
      transform: getTranslateString({ x: 0, y: 0 }),
      transition: '300ms transform ease-in-out',
    },
  ]
}

function DhtPeer({
  inboundQueries = [],
  outboundQueries = [],
  peerId,
  age,
  status,
  timestamp,
  slotRef,
  previousSlotRef,
  showDistance = false,
  noTransition = false,
}) {
  const { setPeerIds } = useContext(SetterContext)

  const config = useContext(ConfigContext)
  const stateDuration = config.getStateSnapshotIntervalMs()

  const runtime = useContext(RuntimeContext)
  const distance = getKademliaDistance(peerId, runtime.getPeerId())

  const peerRef = useRef()
  const transitionStyles = getTransitionStyles(slotRef, previousSlotRef)
  useEffect(() => {
    if (noTransition) return
    const applyTransitionStyles = async i => {
      const styles = transitionStyles[i]
      if (!styles || !peerRef.current) return
      Object.entries(styles).forEach(([key, style]) => {
        peerRef.current.style[key] = style
      })
      setTimeout(() => applyTransitionStyles(i + 1), 0)
    }
    applyTransitionStyles(0)
  })

  const handleMouseOver = () => setPeerIds([peerId])
  const handleMouseOut = () => setPeerIds([])

  return (
    <Container
      age={age}
      ref={peerRef}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <DhtPeerGlow
        inboundQueries={inboundQueries}
        outboundQueries={outboundQueries}
        peerId={peerId}
        timestamp={timestamp}
        stateDuration={stateDuration}
      />
      <InnerChip age={age} status={status} noTransition={noTransition} />
      {showDistance && <Distance>{distance}</Distance>}
      <DhtPeerHighlighting peerId={peerId} />
    </Container>
  )
}

DhtPeer.propTypes = {
  inboundQueries: T.array,
  outboundQueries: T.array,
  age: T.number.isRequired,
  peerId: T.string.isRequired,
  status: T.string.isRequired,
  timestamp: T.number.isRequired,
  slotRef: T.object,
  previousSlotRef: T.object,
  showDistance: T.bool,
  noTransition: T.bool,
}

export default DhtPeer
