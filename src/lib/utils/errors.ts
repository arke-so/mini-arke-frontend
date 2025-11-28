import { ErrorMessagesMapping } from '$fixtures/error-type';

export const DEFAULT_ERROR_MESSAGE = 'Generic Error'
export const BROWSER_ONLY_ERROR_MESSAGE = 'This function can only be called in the browser'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function extractErrorMessage(error: Error | any): Promise<{ message: string; response?: any }> {
  if (!error?.response)
    return {
      message: DEFAULT_ERROR_MESSAGE,
    }

  const response = (await error?.response?.json()) || {}
  const mappedMessage = ErrorMessagesMapping[response?.type]

  if (mappedMessage)
    return {
      message: mappedMessage,
      response,
    }

  

  if (response?.error)
    return {
      message: response?.error,
      response,
    }

  return {
    message: DEFAULT_ERROR_MESSAGE,
    response,
  }
}
