export const UserType = Object.freeze({
  User: 'user',
  Agent: 'agent',
  ProductionWorker: 'production_worker',
})

export type UserType = typeof UserType[keyof typeof UserType]