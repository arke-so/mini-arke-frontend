import { UnitOfMeasures } from '$fixtures/uom'
import { UOMS } from '$lib/app-shared/uoms'
import { _ } from 'svelte-i18n'
import { get } from 'svelte/store'
import type { ExtendedOption } from './generics'

type UOMItem = (typeof UOMS.uoms)[0]

function getLocaleOptions(list: Array<UOMItem>) {
  const $_ = get(_)
  return list.map(uom => ({
    label: $_(uom.i18n),
    value: uom.id,
  }))
}

export function getUnitOfMeasureOptions(): Array<ExtendedOption> {
  return getLocaleOptions(UOMS.uoms.filter(uom => !uom.aggregate))
}

export function getAggregateUnitOfMeasureOptions(): Array<ExtendedOption> {
  return getLocaleOptions(UOMS.uoms.filter(uom => uom.aggregate))
}

export function getUOMDisplayedSymbol(uomCode: string): string {
  const uom = UOMS.uoms.find((uom: UOMItem) => uomCode === uom.id)
  return uom?.i18n || '-'
}

export function getUOMStep(uomCode: string): number {
  const uom = UOMS.uoms.find((uom: UOMItem) => uomCode === uom.id)
  return uom?.step || 1
}

export function getUOMMinQuantity(uomCode: string): number {
  const uom = UOMS.uoms.find((uom: UOMItem) => uomCode === uom.id)
  return uom?.minimum_quantity || 1
}

export function validateUOM(uomCode: string): boolean {
  if (!uomCode) return false
  if (uomCode === UnitOfMeasures.Unset) return false

  return UOMS.uoms.some((uom: UOMItem) => uom.id === uomCode)
}


/**
 * Finds the best matching UOM ID from the available UOMs based on input string
 * @param inputUom - The UOM string to match (e.g., from extracted data)
 * @returns The best matching UOM ID from UOMS.uoms, or 'unit' as fallback
 */
export function getUomBestMatch(inputUom: string, fallbackToDefault: boolean = false): string {
  if (!inputUom || typeof inputUom !== 'string') {
    return fallbackToDefault ? UnitOfMeasures.Default : UnitOfMeasures.Unset
  }

  const normalizedInput = inputUom.trim().toLowerCase()
  
  const exactMatch = UOMS.uoms.find(uom => uom.id.toLowerCase() === normalizedInput)
  if (exactMatch) {
    return exactMatch.id
  }
  
  const aliasMatch = UOM_ALIASES[normalizedInput]
  if (aliasMatch) {
    const aliasUom = UOMS.uoms.find(uom => uom.id === aliasMatch)
    if (aliasUom) {
      return aliasUom.id
    }
  }
  
  for (const uom of UOMS.uoms) {
    if (normalizedInput.includes(uom.id.toLowerCase()) || uom.id.toLowerCase().includes(normalizedInput)) {
      return uom.id
    }
  }
  
  return fallbackToDefault ? UnitOfMeasures.Default : UnitOfMeasures.Unset
}

const UOM_ALIASES: Record<string, string> = {
  // Units/Pieces
  'pcs': 'unit',
  'piece': 'unit',
  'pieces': 'unit',
  'pc': 'unit',
  'units': 'unit',
  'u': 'unit',
  'each': 'unit',
  'nr': 'unit',
  'number': 'unit',
  'pz': 'unit',
  'pzi': 'unit',
  'num': 'unit',

  // Weight
  'kg': 'kilogram',
  'kgs': 'kilogram',
  'kilos': 'kilogram',
  'kilo': 'kilogram',
  
  // Volume/Liquid
  'l': 'liter',
  'liters': 'liter',
  'litres': 'liter',
  'litre': 'liter',
  'lt': 'liter',

  // Length/Dimensions
  'm': 'meter',
  'meters': 'meter',
  'metres': 'meter',
  'metre': 'meter',
  'mt': 'meter',
  
  // Surface
  'sqm': 'square_meter',
  'm2': 'square_meter',
  'm²': 'square_meter',
  'square meter': 'square_meter',
  'square_m': 'square_meter',
  'sqdm': 'square_decimeter',
  'dm2': 'square_decimeter',
  'dm²': 'square_decimeter',
  'square decimeter': 'square_decimeter',
  'square_dm': 'square_decimeter',
  
  // Packaging
  'boxes': 'box',
  'bx': 'box',
  'rolls': 'roll',
  'rl': 'roll',
  'sheets': 'sheet',
  'sh': 'sheet',
  'sht': 'sheet',
  
  // Textiles
  'reels': 'reel',
  'cones': 'cone',
  'cn': 'cone',
}
