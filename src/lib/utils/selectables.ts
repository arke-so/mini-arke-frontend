import type { WithSelection } from "$fixtures/selectables";

export function mapWithSelection<T>(items: Array<T>, defaultStatus: boolean = false): Array<WithSelection<T>> {
  return items.map(item => ({ ...item, selected: defaultStatus }))
}