import * as Assert from '../Assert/Assert.ts'

export const handleContextMenu = async (state: any, x: number, y: number): Promise<any> => {
  Assert.number(x)
  Assert.number(y)
  return state
}
