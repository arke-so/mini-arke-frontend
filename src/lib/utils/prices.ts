import type { PricesAttr } from '$api/supply'
import { getCurrencyDisplayedSybol } from './currencies'
import { comaNotationToDot, dotNotationToComa } from './numbers'

/**
 * Render the price object into a string
 * @param price {PricesAttr | undefined} - The price object to render
 * @returns {string | undefined} - The rendered price
 */
export function renderUnitPrice(price: PricesAttr | undefined): string | undefined {
  return price?.unit !== undefined
    ? `${formatCurrency(floatToCurrencyString(price.unit))} ${getCurrencyDisplayedSybol(price.currency)}`
    : undefined
}

export function renderPrice(amount: number, currency: string): string {
  return `${formatCurrency(floatToCurrencyString(amount))} ${getCurrencyDisplayedSybol(currency)}`
}

/**
 * Format the input string into a currency format
 * @param input {string} - The input string to format
 * @returns {string} - The formatted string
 */
export function formatCurrency(input: string) {
  const COMA_CHAR = ','
  input = input.replace(/[^\d,]/g, '')

  let [leftSide, rightSide] = input.split(COMA_CHAR)

  if (input.indexOf(COMA_CHAR) !== input.lastIndexOf(COMA_CHAR)) {
    rightSide = input.substring(input.indexOf(COMA_CHAR) + 1).replace(/\./g, '')
  }

  if (rightSide) {
    rightSide = rightSide.substring(0, 2)
  }

  return rightSide ? `${leftSide}${COMA_CHAR}${rightSide}` : leftSide
}

export function currencyStringToFloat(input: string) {
  return parseFloat(comaNotationToDot(input))
}

export function floatToCurrencyString(input: number) {
  return dotNotationToComa(input.toFixed(2))
}

export function floatStringToFloat(input: string) {
  return parseFloat(comaNotationToDot(input))
}
