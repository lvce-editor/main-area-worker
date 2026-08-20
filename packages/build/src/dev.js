import { join } from 'node:path'
import { execa } from 'execa'
import { root } from './root.js'

const serverPath = join(root, 'packages', 'server', 'src', 'dev.js')

const main = async () => {
  execa(`npm`, ['run', 'build:watch'], {
    cwd: root,
    stdio: 'inherit',
  })
  execa('node', [serverPath, '--test-path=packages/e2e'], {
    cwd: root,
    stdio: 'inherit',
  })
}

main()
