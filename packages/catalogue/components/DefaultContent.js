import React from 'react'
import styled from 'styled-components'

const DetailsItem = styled.div`
  ${({ theme }) => theme.text('body', 'large')};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const DetailsHeading = styled.h2`
  ${({ theme }) => theme.text('heading', 'large')};
  color: ${({ theme }) => theme.color('highlight')};
`

const DetailsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

function DefaultContent() {
  return (
    <>
      <DetailsItem>
        <DetailsHeading>About</DetailsHeading>
        <p>
          The libp2p Observation Deck helps users observe libp2p activity,
          providing a catalogue of widgets to visualise libp2p introspection
          data.
        </p>
      </DetailsItem>
      <DetailsItem>
        <DetailsHeading>Contribute</DetailsHeading>
        <p>
          Open source contributions are always welcome, from creating new
          widgets to discussing and reviewing widgets from the community.
        </p>
      </DetailsItem>
      <DetailsRow>
        <DetailsHeading>GitHub</DetailsHeading>
        <DetailsHeading>Documentation</DetailsHeading>
      </DetailsRow>
    </>
  )
}

export default DefaultContent
