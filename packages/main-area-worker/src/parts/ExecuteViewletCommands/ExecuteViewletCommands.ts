import type { ViewletCommand } from '../ViewletCommand/ViewletCommand.ts'
import { handleAttach } from '../HandleAttach/HandleAttach.ts'
import { handleCreate } from '../HandleCreate/HandleCreate.ts'
import { handleDetach } from '../HandleDetach/HandleDetach.ts'
import { handleDispose } from '../HandleDispose/HandleDispose.ts'
import { handleSetBounds } from '../HandleSetBounds/HandleSetBounds.ts'

const executeViewletCommand = async (command: ViewletCommand): Promise<void> => {
  switch (command.type) {
    case 'attach':
      await handleAttach(command)
      return
    case 'create':
      await handleCreate(command)
      return
    case 'detach':
      await handleDetach(command)
      return
    case 'dispose':
      await handleDispose(command)
      return
    case 'setBounds':
      await handleSetBounds(command)
      return
  }
}

export const executeViewletCommands = async (commands: readonly ViewletCommand[]): Promise<void> => {
  for (const command of commands) {
    await executeViewletCommand(command)
  }
}
