import { useMemo } from 'react'
import { getLatestTimepoint, getTime } from 'proto'

function useCurrentTime(dataset, time) {
  const currentTimepoint = useMemo(
    () =>
      dataset.find(timepoint => getTime(timepoint) >= time) ||
      getLatestTimepoint(dataset).getInstantTs(),
    [dataset, time]
  )

  return currentTimepoint
}

export default useCurrentTime
