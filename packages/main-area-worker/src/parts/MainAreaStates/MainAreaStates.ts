import * as ViewletRegistry from '@lvce-editor//viewlet-registry'

export const { get, getCommandIds, registerCommands, set, wrapCommand, wrapGetter } = ViewletRegistry.create<any>()
