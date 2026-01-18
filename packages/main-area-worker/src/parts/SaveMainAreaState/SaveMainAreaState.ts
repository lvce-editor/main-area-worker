import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const saveMainAreaState = (state: MainAreaState): string => {
  const { layout } = state
  return JSON.stringify({
    layout,
    version: '1.0.0',
  })
}
