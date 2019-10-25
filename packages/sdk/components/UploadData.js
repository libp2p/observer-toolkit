import React, { useContext } from 'react'

import { parseBuffer } from 'proto'
import { SetterContext } from './DataProvider'

function UploadData() {
  const { dispatchDataset } = useContext(SetterContext)

  function handleUpload(event) {
    const reader = new FileReader()
    reader.onload = handleUploadComplete
    reader.readAsArrayBuffer(event.target.files[0])
  }

  function handleUploadComplete(event) {
    const bin = event.currentTarget.result
    const buf = Buffer.from(bin)
    const data = parseBuffer(buf)
    dispatchDataset({
      action: 'replace',
      data,
    })
  }

  return <input type="file" name="file" onChange={handleUpload} />
}

export default UploadData
