import assert from 'node:assert/strict'
import test from 'node:test'

import { validateDoorSpec } from './validate.js'

const validSpec = {
  door_type: 'double',
  leaf_count: 2,
  overall_width_mm: 1600,
  overall_height_mm: 2400,
  frame_section_mm: 65,
  leaf_thickness_mm: 45,
  material: 'red meranti',
  finish: 'natural polish',
  hinges: { count: 3, positions_mm: [150, 1200, 2250] },
  lock_handle: { stile_side: 'meeting', height_mm: 1000 },
  glazing: { included: false, pane_count: 0, width_mm: null, height_mm: null },
  notes: [],
}

test('validates a matching double-door specification', () => {
  assert.deepEqual(
    validateDoorSpec(validSpec, { brief: 'Double door 1600 x 2400 mm', width_mm: 1600, height_mm: 2400 }),
    { errors: [], warnings: [] },
  )
})

test('reports mismatched dimensions and insufficient hinges', () => {
  const result = validateDoorSpec(
    { ...validSpec, overall_width_mm: 1500, hinges: { count: 2, positions_mm: [150, 2250] } },
    { brief: 'Double door 1600 x 2400 mm', width_mm: 1600, height_mm: 2400 },
  )
  assert.ok(result.errors.some((error) => error.includes('width')))
  assert.ok(result.errors.some((error) => error.includes('hinges')))
})
