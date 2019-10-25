import React from 'react'
import { UploadData, Timeline } from 'sdk'

import approvedViz from '../definitions/approvedViz'
import CatalogueItem from './CatalogueItem'

function Page() {
  return (
    <div>
      <div>
        <UploadData />
      </div>
      {approvedViz.map(({ Component, name, description, tags }) => (
        <CatalogueItem
          key={name}
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
