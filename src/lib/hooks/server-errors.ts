/* eslint-disable no-console */
import { dev } from '$app/environment'
import { logger, SERVICE_NAME } from '$lib/server/logger'
import type { HandleServerError, RequestEvent } from '@sveltejs/kit'

export const serverError: HandleServerError = async ({
  error,
  event,
  status,
  message,
}: {
  error: any
  event: RequestEvent
  status: number
  message: string
}) => {
  status = error?.response?.status || status
  
  let parsedResponse = null;
  let responseUrl = '';
  let responseHeaders = {};
  
  try {
    responseUrl = error?.response?.url || '';
  } catch (e) {
    logger.error('Failed to extract URL:', e);
  }
  
  try {
    if (error?.response?.headers instanceof Headers)
      responseHeaders = Object.fromEntries([...error.response.headers.entries()])
  } catch (e) {
    logger.error('Failed to extract Headers:', e);
  }
  
  try {
    if (error?.response && typeof error.response.json === 'function')
      parsedResponse = await error.response.json();
  } catch (e) {
    logger.error('Failed to parse response JSON:', e);
    parsedResponse = {
      parseError: true,
      message: 'Could not parse response as JSON',
      status: error?.response?.status,
      statusText: error?.response?.statusText
    };
  }
  
  error.parsedResponse = parsedResponse;
  error.url = responseUrl;
  error.headers = responseHeaders;

  if (dev) logger.error(error)
  else if (status !== 404) {
    const ip_address = event?.request?.headers?.get('x-forwarded-for') || event.getClientAddress()
    const { type, stack } = error || {}
    const { sub } = event?.locals?.user || {}

    logger.error({
      service: SERVICE_NAME,
      user: sub,
      error,
      parsedResponse,
      responseUrl,
      responseHeaders,
      message,
      ip_address,
      status,
      stack,
      type,
    })
  }

  if (error?.response) {
    return {
      status,
      message: error.response.statusText || 'Generic API error',
    }
  }

  return {
    status,
    message: error?.text || 'Whoops!',
  }
}
