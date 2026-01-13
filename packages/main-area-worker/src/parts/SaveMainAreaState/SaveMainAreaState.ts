import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const saveMainAreaState = (state: MainAreaState): string => {
  return JSON.stringify({
    layout: state.layout,
    version: '1.0.0',
  })
}
