import * as ApplyRender from '../ApplyRender/ApplyRender.ts'
import * as SourceControlStates from '../MainAreaStates/MainAreaStates.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const render2 = (uid: number, diffResult: readonly number[]): readonly any[] | Promise<readonly any[]> => {
  const { newState, oldState } = SourceControlStates.get(uid)
  SourceControlStates.set(uid, newState, newState)
  const commands = ApplyRender.applyRender(oldState, newState, diffResult)
  if (!RendererProcess.isConnected()) {
    return commands
  }
  return renderDirect(uid, commands)
}

const renderDirect = async (uid: number, commands: readonly any[]): Promise<readonly any[]> => {
  const rendererWorkerCommands = commands.filter((command) => command[0] === 'Viewlet.setFocusContext')
  const rendererProcessCommands = commands.filter((command) => command[0] !== 'Viewlet.setFocusContext')
  const transactionId = await RendererProcess.invoke('Viewlet.queueCommands', uid, rendererProcessCommands)
  return [['Viewlet.commitPending', uid, transactionId], ...rendererWorkerCommands]
}
