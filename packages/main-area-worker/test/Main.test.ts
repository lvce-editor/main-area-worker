import { expect, test } from '@jest/globals'
import * as Main from '../src/parts/Main/Main.ts'

test('main', async () => {
  const { port1, port2 } = new MessageChannel()
  await expect(Main.main(port2)).resolves.toBeUndefined()
  port1.close()
  port2.close()
})
