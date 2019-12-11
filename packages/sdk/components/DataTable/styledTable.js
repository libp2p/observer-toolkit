import styled from 'styled-components'

// TODO: develop these placeholders further
const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`

const TableRow = styled.tr`
  border-bottom: 2px solid ${({ theme }) => theme.color('background', 1)};
  ${({ highlighted, theme }) =>
    highlighted
      ? `background-color: ${theme.color('background', 2, 0.5)};`
      : ''}
`

const TableHead = styled.th`
  ${({ theme }) => theme.styles.tableCell}
  padding-right: 0;
  font-family: plex-sans;
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.color('background', 2)};
  background-color: ${({ theme }) => theme.color('secondary', 1, 0.2)};
  color: ${({ theme }) => theme.color('text', 0, 0.6)};
  text-transform: uppercase;
  white-space: nowrap;
`

const TableCell = styled.td`
  ${({ theme }) => theme.styles.tableCell}
  font-size: 9pt;
  padding-right: ${({ theme }) => theme.spacing(4)};
  font-weight: 400;
  font-family: plex-sans;
  color: ${({ theme }) => theme.color('text', 1)};
  ${({ align }) => align && `text-align: ${align};`}
`

// Provide unstyled styled-components so users can provide overrides using `as`
const THead = styled.thead``
const THeadRow = styled.tr``
const TBody = styled.tbody``

export { Table, TableRow, TableHead, TableCell, THead, THeadRow, TBody }
