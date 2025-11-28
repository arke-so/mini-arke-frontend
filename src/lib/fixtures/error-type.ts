export const ErrorType = Object.freeze({
  InvalidVersion: 'invalid_version_error',
  AlreadyExistingCode: 'already-existing-code',
  NoPhasesFound: 'no-phases-found',
  InvalidProductionPhase: 'invalid-production-phase',
})

export const ErrorMessagesMapping: Record<string, string> = {
  [ErrorType.InvalidVersion]: 'Invalid Version',
  [ErrorType.AlreadyExistingCode]: 'Already Existing Code Message',
  [ErrorType.NoPhasesFound]: 'BOM With No Phases Message',
  [ErrorType.InvalidProductionPhase]: 'BOM With Broken Phases Message',
}
