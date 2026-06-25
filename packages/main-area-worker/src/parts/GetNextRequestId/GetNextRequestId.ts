const requestIdState = {
  counter: 0,
}

export const getNextRequestId = (): number => {
  return ++requestIdState.counter
}

// For testing: reset the request ID counter
export const resetRequestIdCounter = (): void => {
  requestIdState.counter = 0
}
