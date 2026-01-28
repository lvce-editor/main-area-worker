import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { ViewletCommand } from '../ViewletCommand/ViewletCommand.ts'

export interface ViewletLifecycleResult {
  readonly commands: readonly ViewletCommand[]
  readonly newState: MainAreaState
}
