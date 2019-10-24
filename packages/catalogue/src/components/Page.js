import React from 'react'
import { Timeline } from 'sdk'

import approvedViz from '../definitions/approvedViz'
import CatalogueItem from './CatalogueItem'

function Page() {
  return (
    <div>
      {approvedViz.map(viz => (
        <CatalogueItem viz={viz} />
      ))}
      <Timeline />
    </div>
  )
}

export default Page
