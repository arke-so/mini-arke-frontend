import { type CustomFieldDefinitionAttr } from '$api/supply'
import type { ExtendedOption } from './generics'

export type InternalCustomFieldDefinititionAttr = CustomFieldDefinitionAttr & {
  id: string
  created?: boolean
}

export type InternalAttr = {
  id: string
  name: string
}

export function internalToCustomFieldDefinitionAttr(
  field: InternalCustomFieldDefinititionAttr,
): CustomFieldDefinitionAttr {
  const { id, created, ...rest } = field
  return rest
}

export function extendedOptionToAttr(option: ExtendedOption): InternalAttr {
  return {
    id: option.value,
    name: option.label,
  }
}

export function labelToHashedName(label: string): string {
  const MAX_LENGTH = 25
  const temp = label?.trim().length > MAX_LENGTH ? `${label.slice(0, 15)} ${label.slice(-10)}` : label

  return temp
    .normalize('NFD')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s/g, '_')
    .toLowerCase()
}

export const FieldSerializer = {
  Basic: (value: string) => value,
  Switch: (value: boolean) => value,
  Date: (value: Date) => value.getTime(),
  Categories: (value: Array<string>) => value,
  Selector: (option: ExtendedOption) => {
    if (!option) return

    return {
      label: option.label,
      value: option.value,
    }
  },
}

export const FieldDeserializer = {
  Basic: (value: string) => value,
  Switch: (value: boolean) => value,
  Date: (value: number | { label: string; value: number }) => {
    try {
      if (typeof value === 'object' && value?.value) return new Date(value.value)

      return new Date(value as number)
    } catch {
      return new Date()
    }
  },
  Categories: (value: Array<string>) => value,
  Selector: (value: ExtendedOption) => value,
}
