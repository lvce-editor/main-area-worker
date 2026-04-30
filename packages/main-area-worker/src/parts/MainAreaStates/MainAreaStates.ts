import * as ViewletRegistry from '@lvce-editor//viewlet-registry'

export const { clear, get, getCommandIds, getKeys, registerCommands, set, wrapCommand, wrapGetter } = ViewletRegistry.create<any>()
