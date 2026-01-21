let idCounter = 0

export const create = (): number => {
  idCounter++
  return idCounter
}

export const setMinId = (minId: number): void => {
  if (minId > idCounter) {
    idCounter = minId
  }
}
