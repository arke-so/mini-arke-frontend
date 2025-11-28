import type { JWTUser } from '$utils/auth'
import type { UserAccess } from '$utils/permissions'
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  interface Document {
    startViewTransition?(callback: () => Promise<void>): void
  }
  namespace App {
    interface Error {
      status: number
      message: string
    }
    interface Locals {
      token: string | undefined
      user: JWTUser | undefined
      userAccess: UserAccess | undefined
      language: string | undefined
      scheme: 'dark' | 'light' | undefined
      isMobile: boolean
      maintenance: boolean
      isApiKeyAuthenticated: boolean | undefined
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export { }

