import React, { useContext, useEffect, useRef, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { Icon, Tooltip, RootNodeContext } from '@libp2p/observer-sdk'

const HEIGHT = 72
const opacityTransition = {
  property: 'opacity',
  duration: 0.2,
  delay: 0.4,
}

const Container = styled.div`
  cursor: ${({ isSelected }) => (isSelected ? 'initial' : 'pointer')};
  margin: ${({ theme }) => theme.spacing()};
  position: relative;
  background: ${({ theme }) => theme.color('contrast', 2)};
  height: ${HEIGHT}px;
  :before,
  :after {
    content: '';
    z-index: 1;
    border-radius: 50%;
    height: 0;
    width: 0;
    top: 0;
    position: absolute;
    border: ${HEIGHT / 2}px solid ${({ theme }) => theme.color('contrast', 2)};
  }
  :before {
    border-right-color: transparent;
    left: -${HEIGHT / 2}px;
  }
  :after {
    border-left-color: transparent;
    right: -${HEIGHT / 2}px;
  }
`

const ContainerInner = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
`

const IconContainer = styled.div`
  position: relative;
  z-index: ${({ isSelected }) => (isSelected ? 2 : 1)};
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.color('background', 0)};
  margin-left: -${HEIGHT / 2}px;
  height: ${HEIGHT}px;
  width: ${HEIGHT}px;
  display: flex;
  justify-content: center;
  align-items: center;
  &.clickable {
    cursor: pointer;
  }
`

const Details = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  margin-left: ${({ theme }) => theme.spacing(3)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  max-width: ${({ isSelected }) => (isSelected ? '0%' : '100%')};
  opacity: ${({ isSelected }) => (isSelected ? 0 : 1)};
  max-height: ${HEIGHT}px;
  ${({ theme }) =>
    theme.transition([
      {
        property: 'max-width',
      },
      opacityTransition,
    ])}
`

const SlideAcross = styled.div`
  cursor: initial;
  flex-grow: 1;
  flex-shrink: 1;
  max-width: ${({ isSelected }) => (isSelected ? '100%' : '0%')};
  background: ${({ theme }) => theme.color('background')};
  position: relative;
  z-index: ${({ isSelected }) => (isSelected ? 2 : 1)};
  ${({ theme }) => theme.transition()} :before,
  :after {
    content: '';
    z-index: 1;
    border-radius: 50%;
    top: 0;
    position: absolute;
  }
  :before {
    width: 0;
    height: 0;
    border: ${HEIGHT / 2}px solid ${({ theme }) => theme.color('background')};
    left: -${HEIGHT / 2}px;
  }
  :after {
    background: ${({ theme }) => theme.color('background')};
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    max-height: ${HEIGHT}px;
  }
`

const SlideInner = styled.div`
  ${({ theme }) => theme.text('heading', 'large')}
  white-space: nowrap;
  margin: 0;
  position: relative;
  z-index: 2;
  display: flex;
  height: 100%;
  justify-content: center;
  flex-direction: column;
  color: ${({ theme }) => theme.color('highlight', 0)};
  ${({ theme }) => theme.transition(opacityTransition)}
  opacity: ${({ isSelected }) => (isSelected ? 1 : 0)};
`

const Heading = styled.h4`
  ${({ theme }) => theme.text('heading', 'large')}
  color: ${({ theme }) => theme.color('text', 3)};
  margin: ${({ theme }) => theme.spacing([1, 0, 0, 0])};
`

const Description = styled.p`
  ${({ theme }) => theme.text('label', 'large')}
  color: ${({ theme }) => theme.color('text', 3, 0.7)};
  margin: ${({ theme }) => theme.spacing([1, 0])};
`

const CloseIcon = styled(IconContainer)`
  position: relative;
  z-index: 5;
  color: ${({ theme }) => theme.color('background')};
  margin-left: 0;
  margin-right: -${HEIGHT / 2}px;
  background: none;
`

const ActiveData = styled.div`
  ${({ theme }) => theme.text('heading', 'medium')}
  margin-left: ${({ theme }) => theme.spacing(-2)};
  cursor: pointer;
`

const ActiveDataIcon = styled.button`
  margin-right: ${({ theme }) => theme.spacing()};
`

function DataTrayItem({
  isSelected,
  isLoaded,
  select,
  deselect,
  iconType,
  name,
  type,
  description,
  Component,
  isLoading,
  handleUploadStart,
  handleUploadFinished,
  handleUploadChunk,
  handleRemoveData,
}) {
  const rootNodeRef = useContext(RootNodeContext)
  const iconRef = useRef()
  const stopProp = e => e.stopPropagation()
  const [isReopened, setIsReopened] = useState(false)
  useEffect(() => {
    if (!isSelected && isReopened) setIsReopened(false)
  }, [isReopened, isSelected, setIsReopened])

  const isActive = (isLoaded || isLoading) && !isReopened
  const activeDataText = isLoading ? (
    'Loading...'
  ) : (
    <>
      {type}: <b>{name}</b>
    </>
  )

  return (
    <Container onClick={select} isSelected={isSelected}>
      <ContainerInner>
        <SlideAcross onClick={stopProp} isSelected={isSelected}>
          <SlideInner isSelected={isSelected}>
            {isSelected &&
              (isActive ? (
                <ActiveData onClick={select}>
                  <>
                    <Tooltip
                      side="left"
                      fixOn="never"
                      containerRef={rootNodeRef}
                      content="Remove data"
                    >
                      <Icon
                        onClick={handleRemoveData}
                        type="remove"
                        override={{ Container: ActiveDataIcon }}
                      />
                    </Tooltip>
                    <span onClick={() => setIsReopened(true)}>
                      {activeDataText}
                    </span>
                  </>
                </ActiveData>
              ) : (
                <Component
                  iconRef={iconRef}
                  handleUploadStart={handleUploadStart}
                  handleUploadChunk={handleUploadChunk}
                  handleUploadFinished={handleUploadFinished}
                />
              ))}
          </SlideInner>
        </SlideAcross>
        <IconContainer isSelected={isSelected} ref={iconRef}>
          <Icon type={iconType} size="3em" active />
        </IconContainer>
        <Details isSelected={isSelected}>
          {!isSelected && (
            <>
              <Heading>{name}</Heading>
              <Description>{description}</Description>
            </>
          )}
        </Details>
        {isSelected && (
          <CloseIcon>
            <Icon type="cancel" size="3em" onClick={deselect} />
          </CloseIcon>
        )}
      </ContainerInner>
    </Container>
  )
}

DataTrayItem.propTypes = {
  isSelected: T.bool,
  isLoaded: T.bool,
  select: T.func.isRequired,
  deselect: T.func.isRequired,
  iconType: T.string.isRequired,
  name: T.string.isRequired,
  type: T.string.isRequired,
  description: T.string.isRequired,
  Component: T.elementType.isRequired,
  isLoading: T.bool,
  handleUploadStart: T.func.isRequired,
  handleUploadFinished: T.func.isRequired,
  handleUploadChunk: T.func.isRequired,
  handleRemoveData: T.func.isRequired,
}

export default DataTrayItem
