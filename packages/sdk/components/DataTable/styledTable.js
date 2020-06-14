import styled from 'styled-components'

const Table = styled.table`
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
`

const TableRow = styled.tr.attrs(({ highlighted }) => ({
  'data-highlighted': highlighted ? 'highlighted' : null,
}))`
  border-spacing: 0;
  border-bottom: 1px solid ${({ theme }) => theme.color('background', 1, 0.5)};
  ${({ highlighted, theme }) =>
    highlighted
      ? `background-color: ${theme.color('background', 2, 0.5)};`
      : ''}
`

const TableHead = styled.th`
  ${({ sticky }) =>
    sticky
      ? `
    z-index: 8;
    position: sticky;
    top: ${typeof sticky === 'number' ? sticky : 0}px;
  `
      : ''}
  ${({ theme }) => theme.styles.tableCell}
  padding-right: 0;
  font-family: plex-sans;
  font-weight: 600;
  background-color: ${({ theme }) => theme.color('secondary', 2)};
  color: ${({ theme }) => theme.color('text', 1, 0.8)};
  text-transform: uppercase;
  white-space: nowrap;
  width: ${({ width = 'auto' }) => width};
  ${({ align }) => (align ? `text-align: ${align};` : '')}
`

const TableCell = styled.td`
  ${({ theme }) => theme.styles.tableCell}
  padding: ${({ theme, padding = [1, 3.5, 1, 0] }) => theme.spacing(padding)};
  font-weight: 400;
  font-family: plex-sans;
  color: ${({ theme }) => theme.color('text', 1)};
  ${({ align }) => align && `text-align: ${align};`}
`

// Provide unstyled styled-components so users can provide overrides using `as`
const THead = styled.thead``
const THeadRow = styled.tr`
  border-spacing: 0;
`
const TBody = styled.tbody``

export { Table, TableRow, TableHead, TableCell, THead, THeadRow, TBody }
