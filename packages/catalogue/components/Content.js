import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'

const DetailsItem = styled.div`
  ${({ theme }) => theme.text('body', 'large')};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const DetailsContent = styled.div`
  & a {
    font-weight: 600;
    text-decoration: none;
  }
  & a:link {
    color: ${({ theme }) => theme.color('contrast', 1)};
  }
  & a:visited {
    color: ${({ theme }) => theme.color('contrast', 2)};
  }
`

const DetailsAnchor = styled.a`
  color: inherit;
  text-decoration: none;
  padding-bottom: 1px;
  border-bottom: 1px solid
    ${({ href }) => (href ? 'currentColor' : 'transparent')};
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

function Content({ content }) {
  if (!content) return ''

  const rows = content.reduce((rows, item) => {
    if (item.content) return [...rows, item]

    // Bundle link-only or title-only items into same row
    const previousRow = rows[rows.length - 1]
    if (Array.isArray(previousRow)) {
      previousRow.push(item)
      return rows
    }
    return [...rows, [item]]
  }, [])

  return (
    <>
      {rows.map((row, index) => (
        <DetailsRow key={index}>
          {Array.isArray(row) ? (
            row.map(item => (
              <DetailsHeading key={item.title}>
                <DetailsAnchor href={item.url}>{item.title}</DetailsAnchor>
              </DetailsHeading>
            ))
          ) : (
            <DetailsItem key={row.title}>
              <DetailsHeading url={row.url}>{row.title}</DetailsHeading>
              <DetailsContent>
                <ReactMarkdown source={row.content} />
              </DetailsContent>
            </DetailsItem>
          )}
        </DetailsRow>
      ))}
    </>
  )
}

Content.propTypes = {
  content: T.array,
}

export default Content
