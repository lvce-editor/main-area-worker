import * as Listen from '../Listen/Listen.ts'

export const main = async (port: MessagePort): Promise<void> => {
  await Listen.listen(port)
}
