import { UnitOfMeasures } from '$fixtures/uom'
import { validateUOM } from '$utils/uom'
import { describe, expect, it } from 'vitest'

describe('validateUOM', () => {
  it('should return true for valid UOM', () => {
    expect(validateUOM('kilogram')).toBe(true)
  })

  it('should return false for invalid UOM', () => {
    expect(validateUOM('invalid-uom')).toBe(false)
  })

  it('should return false for an unset (not specified by the user) UOM', () => {
    expect(validateUOM(UnitOfMeasures.Unset)).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(validateUOM('')).toBe(false)
  })
  
  it('should return false for null or undefined', () => {
    expect(validateUOM(null as unknown as string)).toBe(false)
    expect(validateUOM(undefined as unknown as string)).toBe(false)
  })
})
