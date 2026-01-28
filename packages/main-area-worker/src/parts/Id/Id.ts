let counter = 0

export const create = (): number => {
  return ++counter
}

export const setMinId = (minId: number): void => {
  if (minId > counter) {
    counter = minId
  }
}
