# Main Area Worker

The Main Area Worker manages the editor's open tabs and editor groups in Lvce Editor. It handles opening and saving editors, tab and group layout changes, and the worker side of main-area RPC. Its command handlers are collected in [`CommandMap.ts`](packages/main-area-worker/src/parts/CommandMap/CommandMap.ts).

## Repository layout

```text
.
├── packages/main-area-worker  # Worker source and unit tests
├── packages/build             # Build, development, static export, and measurement scripts
├── packages/e2e               # Browser end-to-end tests
└── packages/e2e-integration   # Scenarios and scripts for application integration tests
```

The worker starts at [`mainAreaWorkerMain.ts`](packages/main-area-worker/src/mainAreaWorkerMain.ts), which invokes [`MainAreaMain.ts`](packages/main-area-worker/src/parts/MainAreaMain/MainAreaMain.ts). Unit tests are in `packages/main-area-worker/test`.

## Requirements

- Node.js `24.13.0` or a compatible version, as specified in [`.nvmrc`](.nvmrc)
- npm
- Playwright browser binaries for the browser end-to-end tests

Install dependencies from the repository root:

```sh
npm ci
```

## Development commands

Run these commands from the repository root:

| Command                | Description                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `npm run build`        | Builds the worker and writes its package output to `.tmp/dist`.                           |
| `npm run build:watch`  | Rebuilds the worker when source files change.                                             |
| `npm run dev`          | Runs the watch build and the local test server for `packages/e2e`.                        |
| `npm run build:static` | Exports a static test build to `.tmp/static`; run `npm run build` first.                  |
| `npm test`             | Runs available test scripts in npm workspaces, including the main-area worker unit tests. |
| `npm run type-check`   | Type-checks the TypeScript project references.                                            |
| `npm run lint`         | Runs ESLint, Prettier checks, and Knip.                                                   |
| `npm run measure`      | Runs the worker's memory measurement suite.                                               |

Build output includes `.tmp/dist/dist/mainAreaWorkerMain.js` and a generated package manifest. A build also uses the repository's `README.md` and `LICENSE` in that package output.

## Browser tests

The browser suites live in `packages/e2e`. Build first so the local server can load the generated worker:

```sh
npm run build
cd packages/e2e
npx playwright install chromium firefox webkit
npm run e2e:headless
npm run e2e:firefox:headless
npm run e2e:webkit:headless
```

The repository also provides `npm run e2e`, `npm run e2e:firefox`, and `npm run e2e:webkit` for headed runs. In CI, the WebKit suite is excluded on Windows.

Application integration scenarios use a disposable Lvce Editor checkout. See the [`packages/e2e-integration` guide](packages/e2e-integration/README.md) for preparation and execution instructions.

## CI and releases

Pull requests run build, static build, unit tests, type checking, lint, Chromium and Firefox browser suites, WebKit where supported, memory measurement, and Electron tab-move integration tests on Ubuntu, macOS, and Windows. Pushes to `main` run the build, test, browser, and measurement matrix and deploy the static test build to GitHub Pages.

Pushing a version tag matching `v*.*.*` starts the release workflow. It builds the publishable package, publishes it to npm, and publishes the GitHub release after a draft is created.

## License

MIT
