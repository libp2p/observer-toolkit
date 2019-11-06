import styled from 'styled-components'

// TODO: develop these placeholders further
const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  color: ${({ theme }) => theme.color('dark', 'mid')};
`

const TableRow = styled.tr`
  border-bottom: 2px solid ${({ theme }) => theme.color('light', 'mid')};
  ${({ highlighted, theme }) =>
    highlighted
      ? `background-color: ${theme.color('tertiary', 'light', 0.1)};`
      : ''}
`

const TableHead = styled.th`
  ${({ theme }) => theme.styles.tableCell}
  padding-right: 0;
  font-family: plex-sans;
  font-weight: 400;
  border-bottom: 1px solid ${({ theme }) => theme.color('light', 'dark')};
  background-color: ${({ theme }) => theme.color('secondary', 'mid', 0.2)};
  color: ${({ theme }) => theme.color('dark', 'light')};
  text-transform: uppercase;
  white-space: nowrap;
`

const TableCell = styled.td`
  ${({ theme }) => theme.styles.tableCell}
  padding-right: ${({ theme }) => theme.spacing(4)};
  font-weight: 400;
  font-family: plex-sans;
`

// Provide unstyled styled-components so users can provide overrides using `as`
const THead = styled.thead``
const THeadRow = styled.tr``
const TBody = styled.tbody``

export { Table, TableRow, TableHead, TableCell, THead, THeadRow, TBody }
