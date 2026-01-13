import * as ViewletRegistry from '@lvce-editor//viewlet-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const { get, getCommandIds, registerCommands, set, wrapCommand, wrapGetter } = ViewletRegistry.create<MainAreaState>()
