import { ViewletCommand } from '@lvce-editor/constants'
import * as ApplyRender from '../ApplyRender/ApplyRender.ts'
import * as Diff from '../Diff/Diff.ts'
import * as SourceControlStates from '../MainAreaStates/MainAreaStates.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const render2 = (uid: number, _diffResult: readonly number[]): readonly any[] | Promise<readonly any[]> => {
  const { newState, oldState } = SourceControlStates.get(uid)
  // State can change between the caller's diff2 RPC and this render2 RPC.
  // Diff and render the same snapshot before marking it as rendered.
  const diffResult = Diff.diff(oldState, newState)
  SourceControlStates.set(uid, newState, newState)
  const commands = ApplyRender.applyRender(oldState, newState, diffResult)
  if (commands.length === 0 || !RendererProcess.isConnected()) {
    return commands
  }
  return renderDirect(uid, commands)
}

const renderDirect = async (uid: number, commands: readonly any[]): Promise<readonly any[]> => {
  const rendererWorkerCommands = commands.filter((command) => command[0] === ViewletCommand.SetFocusContext)
  const rendererProcessCommands = commands.filter((command) => command[0] !== ViewletCommand.SetFocusContext)
  const transactionId = await RendererProcess.invoke('Viewlet.queueCommands', uid, rendererProcessCommands)
  return [...rendererWorkerCommands, ['Viewlet.commitPending', uid, transactionId]]
}
