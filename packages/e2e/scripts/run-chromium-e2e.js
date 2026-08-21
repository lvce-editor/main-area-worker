import { runBatchedE2E } from './run-batched-e2e.js'

process.exitCode = await runBatchedE2E({
  browser: 'chromium',
  forwardedArgs: ['--reuse-page', ...process.argv.slice(2)],
  testBatchSize: 20,
})
