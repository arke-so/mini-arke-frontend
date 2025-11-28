import type { PricesAttr } from '$api/supply'
import { renderUnitPrice } from '$utils/prices'
import { describe, expect, it } from 'vitest'

describe('renderUnitPrice', () => {
  it('should return formatted price when unit and currency are defined', () => {
    const price: PricesAttr = { unit: 10, currency: 'USD' }
    expect(renderUnitPrice(price)).toBe('10,00 $')
  })

  it('should return formatted price when unit and currency are defined and unit has cents', () => {
    const price: PricesAttr = { unit: 10.6, currency: 'USD' }
    expect(renderUnitPrice(price)).toBe('10,60 $')
  })

  it('should return undefined when price is undefined', () => {
    expect(renderUnitPrice(undefined)).toBeUndefined()
  })

  it('should return undefined when unit is not defined', () => {
    const price: PricesAttr | undefined = undefined
    expect(renderUnitPrice(price)).toBeUndefined()
  })
})
