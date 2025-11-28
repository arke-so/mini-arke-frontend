import { currenciesMap } from '$fixtures/currencies'

/**
 * Get currency symbol
 * @param currencyCode {string} - Currency code
 * @returns {string} - Currency symbol
 */
export function getCurrencyDisplayedSybol(currencyCode: string): string {
  const attr = currenciesMap[currencyCode]?.attr
  
  if (attr && typeof attr === 'object' && attr !== null && 'displayed' in attr) return String(attr.displayed)
  return currencyCode
}
