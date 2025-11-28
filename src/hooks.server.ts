import { domTags } from '$lib/hooks/dom-tags'
import { serverError } from '$lib/hooks/server-errors'
import { sessionDetails } from '$lib/hooks/session-details'
import type { Handle, HandleServerError } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

export const handle: Handle = sequence(
  sessionDetails,
  domTags,
)
export const handleError: HandleServerError = serverError
