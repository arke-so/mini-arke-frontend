import { createClientApiConfig } from '$api/clients-utils/supply-client-side'
import { RawMaterialsApi, type PricesAttr, type PricesAttrDealsInner, type RawMaterialDetails, type RawMaterialSummary } from '$api/supply'
import { browser } from '$app/environment'
import { upsertMaterialAggregateRoute, upsertMaterialRoute } from '$utils/routes'

export type AggregateWithUnits = {
  aggregate: RawMaterialSummary
  units: number
}

export function getDealByQuantity(prices: PricesAttr, quantity: number): PricesAttrDealsInner {
  const deals = [...(prices?.deals || [])].reverse()
  const deal = deals.find(d => d.minQuantity <= quantity)

  if (deal) return deal

  return {
    minQuantity: 1,
    unit: prices?.unit || 0,
    category: '',
  }
}

export function getMaterialAggregateName(materialName: string | undefined | null): string {
  if (!materialName || typeof materialName !== 'string') return ''
  return materialName.replace(/====\(.*$/, '').trim()
}

export function getMaterialName(materialName: string | undefined | null): string {
  if (!materialName || typeof materialName !== 'string') return ''
  
  const parentName = materialName.match(/====\((.*)\)====/)?.[1] || ''
  const aggregateName = getMaterialAggregateName(materialName)

  return parentName ? `${aggregateName} (${parentName})` : aggregateName
}

export function getMaterialStorableName(aggregateName: string | undefined | null, parentName?: string | undefined | null): string {
  if (!aggregateName || typeof aggregateName !== 'string') return ''
  return parentName ? `${aggregateName} ====(${parentName})====` : aggregateName
}

export function getRawMaterialUpsertRoute(material: RawMaterialSummary): string {
  return material?.aggregateOfId
    ? upsertMaterialAggregateRoute(material.aggregateOfId, material.id as string)
    : upsertMaterialRoute({materialId: material.id as string})
}

/**
 * Synchronize the name, description, categories and attributes of a raw material to all its aggregates.
 * This is done on the frontend for fix it quick but will most likely be moved to the backend in the future.
 * @param material 
 * @returns 
 */
export async function updateMaterialRelatives(material: RawMaterialDetails) {
  if (!browser) throw new Error('This function can only be called in the browser')
  if (!material) return

  const rawMaterialId = material.id as string
  const { name, description, attributes, categories} = material
  const materialsApi = new RawMaterialsApi(createClientApiConfig())
  const materialAggregates = await materialsApi.listRawMaterials({ aggregateOf: rawMaterialId })

  if (materialAggregates.length === 0) return

  await Promise.all([
    materialAggregates.map(async (aggregate) => {
      const aggregateId = aggregate.id as string
      const aggregateDetails = await materialsApi.showRawMaterial({ rawMaterialId: aggregateId })
      const aggregateName = getMaterialAggregateName(aggregate.name)

      await materialsApi.updateRawMaterial({
        rawMaterialId: aggregateId,
        rawMaterialDetails: {
          ...aggregateDetails,
          name: getMaterialStorableName(aggregateName, name),
          description,
          attributes,
          categories,
        },
      })
    })
  ])
}