import React, { useEffect, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import uniqueId from 'lodash.uniqueid'

const PaginationContainer = styled.section`
  z-index: 5;
  position: sticky;
  // Extend slightly over to avoid subpixel flashes of content below sticky footer
  bottom: ${({ theme }) => theme.spacing(-0.5)};

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;

  background: ${({ theme }) => theme.color('background', 2)};
  ${({ theme }) => theme.text('body', 'small')};
`

const PaginationBlock = styled.div`
  white-space: nowrap;
  padding: ${({ theme }) => theme.spacing([0, 2, 0.5])};
  min-width: 25%;
  &:last-child {
    text-align: right;
  }
`

const PerPageSelect = styled.select`
  display: inline;
  border: none;
  border-radius: 0;
  background: ${({ theme }) => theme.color('background', 0)};
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(6)};
  cursor: pointer;
`

// Avoid --[useragent]-appearance: none; hacks to remove native select pseudo-border-radius
const PerPageSelectWrapper = styled.span`
  background: ${({ theme }) => theme.color('background', 0)};
  margin: ${({ theme }) => theme.spacing([1, 0, 1, 1])};
  display: inline-flex;
  padding: ${({ theme }) => theme.spacing([0, 1, 0, 0.5])};
`

const PagerButton = styled.button`
  text-align: center;
  font-weight: 900;
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
  margin: ${({ theme }) => theme.spacing()};

  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  color: ${({ theme, disabled }) =>
    disabled ? theme.color('text', 2) : theme.color('highlight')};
  background-color: ${({ theme, disabled }) =>
    theme.color('background', disabled ? 1 : 0)};
`
const PagerInput = styled.input`
  padding: ${({ theme }) => theme.spacing()};
  color: ${({ theme, inactive }) => theme.color('text', inactive ? 2 : 0)};
  background-color: ${({ theme, inactive }) =>
    theme.color('background', inactive ? 1 : 0)};
  border: none;
  margin: ${({ theme }) => theme.spacing([0, 0.5])};
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(8)};
`
const Pager = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

function getPageIndex(rowIndex, rowsPerPage) {
  return Math.floor(rowIndex / rowsPerPage)
}

function getRange(pageIndex, rowsPerPage) {
  return [pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage]
}

function DataTablePagination({
  rowCounts,
  setRange,
  rowsPerPageOptions = [10, 25, 50, 100],
  defaultPerPageIndex = 1,
  override = {},
}) {
  const [id] = useState(() => uniqueId('DataTablePagination_'))
  const [rowsPerPageIndex, setRowsPerPageIndex] = useState(defaultPerPageIndex)

  const rowsPerPage = rowCounts.maxShown
  const rowsThisPage = rowCounts.shown

  const totalPages = Math.ceil(rowCounts.total / rowsPerPage)
  const appliedPageIndex = rowCounts.showFrom
    ? getPageIndex(rowCounts.showFrom, rowsPerPage)
    : 0

  const [displayedPageIndex, setDisplayedPageIndex] = useState(appliedPageIndex)
  const displayedPageNumber =
    displayedPageIndex >= 0 ? displayedPageIndex + 1 : ''

  useEffect(() => {
    if (rowsThisPage === 0 && totalPages > 0) {
      // Get last page if we end up after the last page e.g. after using timeline
      updatePageIndex(totalPages - 1)
    }
    if (rowsThisPage > rowsPerPageOptions[rowsPerPageIndex]) {
      // Apply range if it hasn't been applied already
      setRange(
        getRange(displayedPageIndex, rowsPerPageOptions[rowsPerPageIndex])
      )
    }
  })

  if (!rowCounts.total) return ''

  const getValidPageIndex = pageIndex =>
    Math.min(totalPages - 1, Math.max(0, pageIndex))

  const updatePageIndex = (newPageIndex, skipValidation = false) => {
    const validPageIndex = skipValidation
      ? newPageIndex
      : getValidPageIndex(newPageIndex)
    setRange(getRange(validPageIndex, rowsPerPage))
    setDisplayedPageIndex(validPageIndex)
  }
  const handlePerPageChange = e => {
    const newRowsPerPageIndex = Number(e.target.value)
    setRowsPerPageIndex(newRowsPerPageIndex)

    // Go to a page that contains the current first row
    const newRowsPerPage = rowsPerPageOptions[newRowsPerPageIndex]
    const newPageIndex = getPageIndex(rowCounts.showFrom, newRowsPerPage)
    setDisplayedPageIndex(newPageIndex)
    setRange(getRange(newPageIndex, newRowsPerPage))
  }
  const handlePagerChange = e => {
    const newPageIndex = Number(e.target.value) - 1
    const validPageIndex = getValidPageIndex(newPageIndex)

    if (validPageIndex !== newPageIndex) {
      // Just update number if currently invalid, to allow user to finish typing
      setDisplayedPageIndex(newPageIndex)
      return
    }

    updatePageIndex(validPageIndex, true)
  }
  const handlePagerBlur = () => {
    setDisplayedPageIndex(appliedPageIndex)
  }
  const goToFirst = () => updatePageIndex(0)
  const goToNext = () => updatePageIndex(displayedPageIndex + 1)
  const goToPrevious = () => updatePageIndex(displayedPageIndex - 1)
  const goToLast = () => updatePageIndex(totalPages - 1)

  return (
    <PaginationContainer as={override.PaginationContainer}>
      <PaginationBlock as={override.PaginationBlock}>
        Showing rows {rowCounts.showFrom + 1} to{' '}
        {rowCounts.showFrom + rowsThisPage}
      </PaginationBlock>
      <PaginationBlock as={override.PaginationBlock}>
        <Pager>
          <PagerButton
            onClick={goToFirst}
            disabled={appliedPageIndex === 0}
            title="Show first page"
          >
            ⇤
          </PagerButton>
          <PagerButton
            onClick={goToPrevious}
            disabled={appliedPageIndex === 0}
            title="Show previous page"
          >
            ←
          </PagerButton>
          Page
          <PagerInput
            type="number"
            value={displayedPageNumber}
            onChange={handlePagerChange}
            onBlur={handlePagerBlur}
            inactive={totalPages <= 1}
          />{' '}
          of {totalPages}
          <PagerButton
            onClick={goToNext}
            disabled={appliedPageIndex === totalPages - 1}
            title="Show next page"
          >
            →
          </PagerButton>
          <PagerButton
            onClick={goToLast}
            disabled={appliedPageIndex === totalPages - 1}
            title="Show last page"
          >
            ⇥
          </PagerButton>
        </Pager>
      </PaginationBlock>
      <PaginationBlock as={override.PaginationBlock}>
        <label id={`${id}_perPage`}>Rows per page:</label>
        <PerPageSelectWrapper>
          <PerPageSelect
            aria-labelledby={`${id}_perPage`}
            name="PerPage"
            type="list"
            onChange={handlePerPageChange}
            defaultValue={rowsPerPageIndex}
          >
            {rowsPerPageOptions.map((perPageOption, optionIndex) => (
              <option key={perPageOption} value={optionIndex}>
                {perPageOption}
              </option>
            ))}
          </PerPageSelect>
        </PerPageSelectWrapper>
      </PaginationBlock>
    </PaginationContainer>
  )
}

DataTablePagination.propTypes = {
  rowCounts: T.object.isRequired,
  setRange: T.func.isRequired,
  rowsPerPageOptions: T.array,
  defaultPerPageIndex: T.number,
  override: T.object,
}

export default DataTablePagination
