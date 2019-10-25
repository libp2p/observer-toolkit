import React from 'react'
import { Timeline } from 'sdk'

import approvedViz from '../definitions/approvedViz'
import CatalogueItem from './CatalogueItem'

function Page() {
  return (
    <div>
      {approvedViz.map(({ Component, name, description, tags }) => (
        <CatalogueItem
          Component={Component}
          name={name}
          description={description}
          tags={tags}
        />
      ))}
      <Timeline />
    </div>
  )
}

export default Page
