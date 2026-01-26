import type { ViewletCommand } from '../ViewletCommand/ViewletCommand.ts'
import { handleAttach } from './HandleAttach/HandleAttach.ts'
import { handleCreate } from './HandleCreate/HandleCreate.ts'
import { handleDetach } from './HandleDetach/HandleDetach.ts'
import { handleDispose } from './HandleDispose/HandleDispose.ts'
import { handleSetBounds } from './HandleSetBounds/HandleSetBounds.ts'

export const executeViewletCommands = async (commands: readonly ViewletCommand[], uid?: number): Promise<void> => {
  for (const command of commands) {
    switch (command.type) {
      case 'attach':
        await handleAttach(command)
        break
      case 'create':
        await handleCreate(command, uid)
        break
      case 'detach':
        await handleDetach(command)
        break
      case 'dispose':
        await handleDispose(command)
        break
      case 'setBounds':
        await handleSetBounds(command)
        break
    }
  }
}
