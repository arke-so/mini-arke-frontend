export type UOM = {
  id: string
  i18n: string
  aggregate: boolean
  step: number
  minimum_quantity: number
  category: string
}

export interface UOMS {
  uoms: Array<UOM>
}
