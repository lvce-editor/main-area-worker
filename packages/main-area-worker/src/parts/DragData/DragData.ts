const data = Object.create(null)

export const set = (uid: any, value: any): void => {
  data[uid] = value
}

export const get = (uid: any): any => {
  return data[uid]
}
