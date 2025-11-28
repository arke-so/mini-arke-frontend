import { APP_BASE_PATH } from '$fixtures/constants'
import {
  accountingRoute,
  accountingRouteId,
  adminRoute,
  adminRouteId,
  appRootRoute,
  appRootRouteId,
  cloneMaterialRoute,
  cloneProductRoute,
  contactsRoute,
  contactsRouteId,
  createRoute,
  goodsRoute,
  goodsRouteId,
  healthRoute,
  healthRouteId,
  isCurrentRoute,
  loginRoute,
  loginRouteId,
  purchaseRoute,
  purchaseRouteId,
  settingsRoute,
  settingsRouteId,
  stockRoute,
  stockRouteId,
  upsertSupplierRoute,
  upsertUserRoute,
  usersRoute,
  usersRouteId,
} from '$utils/routes'
import { describe, expect, it } from 'vitest'

describe('createRoute utility', () => {
  describe('routeOptions.cloneId', () => {
    it('Should create a route with a cloneId query parameter', () => {
      expect(createRoute('/some/route', { cloneId: 'foo' })).toBe('/app/some/route?cloneId=foo')
    })

    it('Should create a route without a cloneId query parameter when the cloneId is invalid', () => {
      expect(createRoute('/some/route', { cloneId: null! })).toBe('/app/some/route')
    })
  })

  describe('routeOptions.inputPayload', () => {
    it('Should create a route with an inputPayload query parameter', () => {
      const exampleObject = { foo: 'bar' }
      const params = new URLSearchParams()
      params.set('inputPayload', JSON.stringify(exampleObject))

      expect(createRoute('/some/route', { inputPayload: exampleObject })).toBe(`/app/some/route?${params.toString()}`)
    })

    it('Should create a route without an inputPayload query parameter when the object is invalid', () => {
      const exampleObject = null
      expect(createRoute('/some/route', { inputPayload: exampleObject })).toBe(`/app/some/route`)
    })
  })
})

describe('Route Utilities', () => {
  it('should return the correct login route', () => {
    expect(loginRouteId()).toBe('/login')
    expect(loginRoute()).toBe('/login')
  })

  it('should return the correct health route', () => {
    expect(healthRouteId()).toBe('/healthz')
    expect(healthRoute()).toBe('/healthz')
  })

  it('should return the correct app root route', () => {
    expect(appRootRouteId()).toBe(`${APP_BASE_PATH}/(index)`)
    expect(appRootRoute()).toBe(`${APP_BASE_PATH}`)
  })

  it('should return the correct buy route', () => {
    expect(purchaseRouteId()).toBe(`${APP_BASE_PATH}/(index)/purchase`)
    expect(purchaseRoute()).toBe(`${APP_BASE_PATH}/purchase`)
  })

  it('should return the correct goods route', () => {
    expect(goodsRouteId()).toBe(`${APP_BASE_PATH}/(index)/goods`)
    expect(goodsRoute()).toBe(`${APP_BASE_PATH}/goods`)
  })

  it('should return the correct stock route', () => {
    expect(stockRouteId()).toBe(`${APP_BASE_PATH}/(index)/stock`)
    expect(stockRoute()).toBe(`${APP_BASE_PATH}/stock`)
  })

  it('should return the correct contacts route', () => {
    expect(contactsRouteId()).toBe(`${APP_BASE_PATH}/(index)/contacts`)
    expect(contactsRoute()).toBe(`${APP_BASE_PATH}/contacts`)
  })

  it('should return the correct accounting route', () => {
    expect(accountingRouteId()).toBe(`${APP_BASE_PATH}/(index)/accounting`)
    expect(accountingRoute()).toBe(`${APP_BASE_PATH}/accounting`)
  })

  it('should return the correct settings route', () => {
    expect(settingsRouteId()).toBe(`${APP_BASE_PATH}/(index)/settings`)
    expect(settingsRoute()).toBe(`${APP_BASE_PATH}/settings`)
  })

  it('should return the correct users route', () => {
    expect(usersRouteId()).toBe(`${APP_BASE_PATH}/(index)/settings/users`)
    expect(usersRoute()).toBe(`${APP_BASE_PATH}/settings/users`)
  })

  it('should return the correct upsert user route', () => {
    expect(upsertUserRoute('123')).toBe(`${APP_BASE_PATH}/settings/users/upsert/123`)
    expect(upsertUserRoute()).toBe(`${APP_BASE_PATH}/settings/users/upsert/`)
  })

  it('should return the correct upsert supplier route', () => {
    expect(upsertSupplierRoute('456')).toBe(`${APP_BASE_PATH}/contacts/suppliers/upsert/456`)
    expect(upsertSupplierRoute()).toBe(`${APP_BASE_PATH}/contacts/suppliers/upsert/`)
  })

  it('should return the correct admin route', () => {
    expect(adminRouteId()).toBe(`${APP_BASE_PATH}/(index)/admin`)
    expect(adminRoute()).toBe(`${APP_BASE_PATH}/admin`)
  })

  it('should correctly identify the current route', () => {
    expect(isCurrentRoute('/login', '/login')).toBe(true)
    expect(isCurrentRoute('/login', '/healthz')).toBe(false)
  })

  it('should generate URL with cloneId query param with materialId', () => {
    const materialId = '123'
    expect(cloneMaterialRoute({ materialId })).toBe(`${APP_BASE_PATH}/goods/materials/upsert?cloneId=${materialId}`)
  })

  it('should generate URL with cloneId query param with productId', () => {
    const productId = '456'
    expect(cloneProductRoute({ productId })).toBe(`${APP_BASE_PATH}/goods/products/upsert?cloneId=${productId}`)
  })
})
