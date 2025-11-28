import type { ExtendedOption } from '$utils/generics'

export type SeenRecords = {
  [key: string]: {
    seen: Array<string>
    type: string
  }
}

/**
 * Convert records to options, usable for any select component
 * @param records {Record<string, any>} - the records to convert
 * @returns {Array<ExtendedOption>} - the options
 */
export function recordsToOptions(records: Record<string, any>): Array<ExtendedOption> {
  return Object.entries(records).map(([value, label]) => ({
    label,
    value,
  }))
}

/**
 * Convert a string to an array of valid options with 1 item, if the string is not empty
 * @param value {string} - the string to convert
 * @returns {Array<ExtendedOption>} - the options
 */
export function stringToValidOptions(value: string): Array<ExtendedOption> {
  return !!value?.trim() ? [{ label: value, value }] : []
}
