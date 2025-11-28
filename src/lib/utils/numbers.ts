import { getNumberFormatter } from 'svelte-i18n'

export function dotNotationToComa(input: string) {
  return input.replace(/\./g, ',')
}

export function comaNotationToDot(input: string) {
  return input.replace(/,/g, '.')
}

export function formatFloatNumber(input: number) {
  return getNumberFormatter({ useGrouping: false, maximumFractionDigits: 3 }).format(input)
}
