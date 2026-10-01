const state = {
  configured: false,
  lastId: -1,
  nextId: 0,
  reservedIds: new Set<number>(),
}

export const reserve = (ids: readonly number[]): void => {
  for (const id of ids) {
    if (id >= state.nextId && id <= state.lastId) {
      state.reservedIds.add(id)
    }
  }
}

export const configure = (start: number, end: number): void => {
  const { configured } = state
  if (configured) {
    throw new Error('Component id range is already configured')
  }
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start <= 0 || end < start) {
    throw new Error('Invalid component id range')
  }
  state.nextId = start
  state.lastId = end
  state.configured = true
}

export const create = (): number => {
  const { configured, lastId, reservedIds } = state
  if (!configured) {
    // Compatibility with renderer versions that do not assign worker id ranges.
    return Math.random()
  }
  while (reservedIds.delete(state.nextId)) {
    state.nextId++
  }
  if (state.nextId > lastId) {
    throw new Error('Component id range exhausted')
  }
  return state.nextId++
}
