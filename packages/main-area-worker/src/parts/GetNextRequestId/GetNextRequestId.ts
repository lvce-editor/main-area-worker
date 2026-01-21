// Counter for request IDs to handle race conditions
let requestIdCounter = 0

export const getNextRequestId = (): number => {
  return ++requestIdCounter
}

// For testing: reset the request ID counter
export const resetRequestIdCounter = (): void => {
  requestIdCounter = 0
}
