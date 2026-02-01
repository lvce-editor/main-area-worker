import { RendererWorker } from '@lvce-editor/rpc-registry'

export const handleClickProblems = async (): Promise<void> => {
  await RendererWorker.invoke('Layout.showPanel')

  await RendererWorker.invoke('Panel.toggleView', 'Problems')
}
