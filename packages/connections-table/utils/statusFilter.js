import React from 'react'
import T from 'prop-types'

import { statusNames } from 'proto'
import { CheckboxList, doFilterToWhitelist } from 'sdk'

const statusValues = Object.values(statusNames)

function StatusFilterUi({ onChange }) {
  const handleChange = values =>
    // Convert object like { a: true, b: false, c: true } to array like [ a, c ]
    onChange(Object.keys(values).filter(key => values[key]))

  return (
    <div>
      <CheckboxList
        fieldNames={statusValues}
        defaultValue={true}
        onChange={handleChange}
        title="Filter status"
      />
    </div>
  )
}
StatusFilterUi.propTypes = {
  onChange: T.func.isRequired,
}

const name = 'statusFilter'
const doFilter = doFilterToWhitelist
const filterUi = StatusFilterUi
const initialValues = statusValues

export { name, doFilter, filterUi, initialValues }
