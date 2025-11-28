const entityToIdMap = new WeakMap<any, string>()
let globalCounter = 0

/**
 * Wraps entities with unique DnD IDs for use with svelte-dnd-action.
 * Each entity gets a stable ID that persists across re-renders.
 */
export function withUniqueDndIds<T>(entities: T[]): any[] {
  return entities.map(entity => {
    const originalEntity = (entity as any)?._originalEntity || entity

    let dndId = entityToIdMap.get(originalEntity)
    if (!dndId) {
      dndId = `dnd-${globalCounter++}`
      entityToIdMap.set(originalEntity, dndId)
    }

    return { ...originalEntity, id: dndId, _originalEntity: originalEntity }
  })
}

/**
 * Unwraps entities from their DnD wrapper, returning the original entities.
 */
export function unwrapDndIds<T>(entities: any[]): T[] {
  return entities.map(entity => entity._originalEntity || entity)
}