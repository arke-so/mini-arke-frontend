<script context="module" lang="ts">
  export type NavLink = {
    label: string
    href: string
    routeId: string
    visible?: boolean
    disabled?: boolean
    exact?: boolean
    attentionNeeded?: boolean
    usePathname?: boolean
    useQueryParam?: string
    icon?: any
    routeParams?: Record<string, string> | undefined
  }
</script>

<script lang="ts">
  import { page } from '$app/stores'
  import { isCurrentRoute } from '$utils/routes'

  export let href: string
  export let routeId: string
  export let exact: boolean = true
  export let usePathname: boolean = false
  export let useQueryParam: string = ''
  export let routeParams: Record<string, string> | undefined = undefined

  function removeTrailingSlash(s: string) {
    return s.endsWith('/') ? s.slice(0, -1) : s
  }

  function isPathMatching(pathname: string) {
    return exact ? pathname === removeTrailingSlash(href) : pathname.startsWith(href)
  }

  function matcher(page: { url: URL; route: { id: string | null }; params: Record<string, string> }) {
    if (routeParams) {
      const paramsMatch = Object.entries(routeParams).every(([key, value]) => page.params[key] === value)
      return paramsMatch && isPathMatching(page.url.pathname)
    }
    if (usePathname) return isPathMatching(page.url.pathname)
    if (useQueryParam) return $page.url.searchParams.get(useQueryParam) === queryParam
    else if (exact) return isCurrentRoute(page.route.id, routeId)
    else return page.route.id?.startsWith(routeId)
  }

  $: searchParams = useQueryParam ? new URLSearchParams(href) : null
  $: queryParam = searchParams?.get(useQueryParam)
  $: active = matcher($page)
</script>

<slot {active} />
