
export const LocalesKey = Object.freeze({
  Italian: 'it-IT',
  English: 'en-US',
})

export function getTranslationKey(key: string) {
  return key.split(/[_\s]/).map(capitalize).join(' ')
}

export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

export function normalizeDBLabels(label: string) {
  if (label?.endsWith('_attr')) return getTranslationKey(label.replace(/\_attr/, ''))
  if (label === 'external_id' || label === 'internal_id') return 'Unique ID'
  if (label === 'product_id') return 'Product ID'
  if (label === 'order_id') return 'Order ID'
  if (label?.endsWith('_id')) return getTranslationKey(label.replace(/_id$/, '')) + ' ID'
  if (label === 'id') return 'ID'
  if (label === 'uom') return 'UOM'
  if (label === 'vat_no') return 'VAT Number'
  if (label === 'time') return 'Date'

  return getTranslationKey(label)
}

export function getRoleLabel(role: string): string {
  return `${normalizeDBLabels(role)} (role)`
}
