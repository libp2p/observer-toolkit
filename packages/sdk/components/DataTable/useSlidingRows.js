import { useEffect, useState } from 'react'
import T from 'prop-types'

function getInsertedRowsCount(shownContent, previousShownContent) {
  const insertedRows = []

  for (const shownRow of shownContent) {
    if (!shownRow.key) break // no-op unless all rows have pre-defined keys

    // Loop until we find the first non-new row
    if (previousShownContent.some(row => row.key === shownRow.key)) {
      break
    }

    insertedRows.push(shownRow)
  }
  return insertedRows.length
}

function getChangedShownRows(shownRows, insertedRowsCount, previousAllContent) {
  const appearingRows = []

  const slidingShownRows = shownRows.slice(insertedRowsCount).filter(row => {
    const previousRow = previousAllContent.find(
      oldRow => oldRow.key === row.key
    )
    if (!previousRow) {
      appearingRows.push(row)
      return false
    }
    // Account for inserted rows because they will be slid by sliding the whole tbody
    const expectedIndex = previousRow.index + insertedRowsCount

    return expectedIndex !== row.index
  })

  return {
    appearingRows,
    slidingShownRows,
  }
}

function getNewlyUnshownRows(previousShownContent, shownContent, allContent) {
  const missingRows = previousShownContent.reduce(
    (missingRows, oldRow) => {
      if (shownContent.some(row => row.key === oldRow.key)) return missingRows

      const outOfBoundsRow = allContent.find(row => row.key === oldRow.key)
      if (outOfBoundsRow) {
        missingRows.slidingOutRows.push(outOfBoundsRow)
      } else {
        missingRows.disappearingRows.push(oldRow)
      }
      return missingRows
    },
    {
      slidingOutRows: [],
      disappearingRows: [],
    }
  )
  return missingRows
}

function slideInsertedRows(
  insertedRowsCount,
  rowHeight,
  tbodyRef,
  slidingRowsRef
) {
  if (!insertedRowsCount) return

  const offset = rowHeight * insertedRowsCount

  tbodyRef.current.style.transition = ''
  slidingRowsRef.current.style.transition = ''
  tbodyRef.current.style.transform = `translateY(${-1 * offset}px)`
  slidingRowsRef.current.style.transform = `translateY(${-1 * offset}px)`

  setTimeout(() => {
    tbodyRef.current.style.transition = '300ms transform ease-in-out'
    slidingRowsRef.current.style.transition = '300ms transform ease-in-out'
    tbodyRef.current.style.transform = `translateY(0px)`
    slidingRowsRef.current.style.transform = `translateY(0px)`
  })
}

function getSlidingRowsByType(
  shownContent,
  allContent,
  previousShownContent,
  previousAllContent
) {
  const insertedRowsCount = getInsertedRowsCount(
    shownContent,
    previousShownContent
  )
  const { appearingRows, slidingShownRows } = getChangedShownRows(
    shownContent,
    insertedRowsCount,
    previousAllContent
  )
  const { slidingOutRows, disappearingRows } = getNewlyUnshownRows(
    previousShownContent,
    shownContent,
    allContent
  )

  return {
    insertedRowsCount,
    appearingRows,
    disappearingRows,
    slidingShownRows,
    slidingOutRows,
    previousAllContent,
  }
}

function useSlidingRows({
  allContent,
  shownContent,
  tbodyRef,
  slidingRowsRef,
  slideDuration,
  rowHeight,
  disabled = false,
}) {
  const [previousShownContent, setPreviousShownContent] = useState(shownContent)
  const [previousAllContent, setPreviousAllContent] = useState(shownContent)
  const [previousSlidingRowsByType, setPreviousSlidingRowsByType] = useState(
    disabled
      ? null
      : getSlidingRowsByType(
          shownContent,
          allContent,
          previousShownContent,
          previousAllContent
        )
  )

  const isUnchanged = disabled || shownContent === previousShownContent

  const slidingRowsByType = isUnchanged
    ? previousSlidingRowsByType
    : getSlidingRowsByType(
        shownContent,
        allContent,
        previousShownContent,
        previousAllContent
      )

  useEffect(() => {
    if (isUnchanged || !slidingRowsRef.current) return

    const { insertedRowsCount } = slidingRowsByType
    slideInsertedRows(insertedRowsCount, rowHeight, tbodyRef, slidingRowsRef)

    // These will re-render the hook but isUnchanged will be true so will be no-op with === return value
    setPreviousShownContent(shownContent)
    setPreviousAllContent(allContent)
    setPreviousSlidingRowsByType(slidingRowsByType)
  }, [
    slidingRowsByType,
    rowHeight,
    slidingRowsRef,
    tbodyRef,
    isUnchanged,
    shownContent,
    allContent,
  ])

  return slidingRowsByType
}

useSlidingRows.propTypes = {
  allContent: T.array.isRequired,
  shownContent: T.array.isRequired,
  tbodyRef: T.object.isRequired,
  slidingRowsRef: T.object.isRequired,
  slideDuration: T.number.isRequired,
  rowHeight: T.number,
  disabled: T.bool,
}

export default useSlidingRows
