import { expect, test } from '@jest/globals'
import * as Listen from '../src/parts/Listen/Listen.ts'

test('listen', async () => {
  const { port1, port2 } = new MessageChannel()
  await expect(Listen.listen(port2)).resolves.toBeUndefined()
  port1.close()
  port2.close()
})
