import { getCurrencyDisplayedSybol } from '$utils/currencies'
import { describe, expect, it } from 'vitest'

describe('currencies.ts', () => {
  describe('getCurrencyDisplayedSybol', () => {
    it('should return the displayed symbol for existing currency code', () => {
      expect(getCurrencyDisplayedSybol('EUR')).toBe('€')
      expect(getCurrencyDisplayedSybol('USD')).toBe('$')
      expect(getCurrencyDisplayedSybol('GBP')).toBe('£')
    })

    it('should return the currency code if currency is not found', () => {
      expect(getCurrencyDisplayedSybol('XYZ')).toBe('XYZ')
    })

    it('should handle null or undefined currency code by returning input', () => {
      // @ts-ignore: Testing with invalid input
      expect(getCurrencyDisplayedSybol(null)).toBe(null)
      // @ts-ignore: Testing with invalid input
      expect(getCurrencyDisplayedSybol(undefined)).toBe(undefined)
    })
  })
})
