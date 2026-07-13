import * as ViewletRegistry from '@lvce-editor/viewlet-registry'

export const { clear, get, getCommandIds, getKeys, registerCommands, set, wrapAsyncCommand, wrapGetter, wrapSerialAsyncCommand, wrapSerialCommand } =
  ViewletRegistry.create<any>()
