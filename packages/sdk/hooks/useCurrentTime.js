import { useMemo } from 'react'

function useCurrentTime(dataset, time) {
  const currentTimepoint = useMemo(
    () =>
      dataset.find(timepoint => getTime(timepoint) >= time) ||
      getDefaultTime(dataset),
    [dataset, time]
  )

  return currentTimepoint
}

export default useCurrentTime
