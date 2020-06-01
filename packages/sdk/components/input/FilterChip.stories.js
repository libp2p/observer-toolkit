import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'

import { getListFilter, getRangeFilter } from '../../filters'
import { useFilter } from '../../hooks'
import { formatTime } from '../../utils'
import Chip from '../Chip'
import FilterChip from './FilterChip'

function FilterWrapper({ filterDef, items }) {
  const { applyFilters, dispatchFilters, filters } = useFilter([filterDef])

  const chipOptions = {
    a: { colorKey: 'primary' },
    b: { colorKey: 'secondary' },
    c: { colorKey: 'tertiary' },
  }

  return (
    <div>
      <div>
        {items.filter(applyFilters).map(item => (
          <Chip
            key={item.value}
            type={item.type}
            options={chipOptions}
          >{`"${item.value}"`}</Chip>
        ))}
      </div>
      <FilterChip
        filter={filters[0]}
        dispatchFilters={dispatchFilters}
      ></FilterChip>
    </div>
  )
}

const slideItems = [
  { type: 'a', value: 0 },
  { type: 'a', value: 2 },
  { type: 'b', value: 4 },
  { type: 'b', value: 6 },
  { type: 'c', value: 8 },
  { type: 'c', value: 10 },
]

const timestamp = 1580558228876
const timeItems = [
  { type: 'a', ts: timestamp },
  { type: 'a', ts: timestamp + 30000 },
  { type: 'b', ts: timestamp + 40000 },
  { type: 'b', ts: timestamp + 70000 },
  { type: 'c', ts: timestamp + 140000 },
  { type: 'c', ts: timestamp + 220000 },
].map(item => ({
  ...item,
  value: formatTime(item.ts),
}))

const checkboxItems = [
  { type: 'a', value: 'a-1' },
  { type: 'a', value: 'a-2' },
  { type: 'b', value: 'b-1' },
  { type: 'b', value: 'b-2' },
  { type: 'c', value: 'c-1' },
  { type: 'c', value: 'c-2' },
]

const slideFilterDef = getRangeFilter({
  name: 'Slider-based filter',
  mapFilter: d => d.value,
  max: 10,
})

const timeFilterDef = getRangeFilter({
  name: 'Slider-based time filter',
  mapFilter: d => d.ts,
  min: timestamp,
  max: timestamp + 220000,
  numberFieldType: 'time',
})

const checkboxFilterDef = getListFilter({
  name: 'Checkbox-based filter',
  mapFilter: d => d.type,
  valueNames: ['a', 'b', 'c'],
})

storiesOf('FilterChip', module).add(
  'Slider',
  () => <FilterWrapper filterDef={slideFilterDef} items={slideItems} />,
  {
    wrapper: 'theme',
  }
)

storiesOf('FilterChip', module).add(
  'Time slider',
  () => <FilterWrapper filterDef={timeFilterDef} items={timeItems} />,
  {
    wrapper: 'theme',
  }
)

storiesOf('FilterChip', module).add(
  'Checkboxes',
  () => <FilterWrapper filterDef={checkboxFilterDef} items={checkboxItems} />,
  {
    wrapper: 'theme',
  }
)
