import React from 'react'
import { Timeline } from 'sdk'

import approvedViz from '../approvedViz'
import CatalogueItem from './CatalogueItem'

function Page() {
  return (
    <ThemeSetter>
      <DataProvider>
        <div>
          {approvedViz.map(viz => (
            <CatalogueItem viz={viz} />
          ))}
          <Timeline />
        </div>
      </DataProvider>
    </ThemeSetter>
  )
}

export default Page
