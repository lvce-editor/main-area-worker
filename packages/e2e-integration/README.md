# Application integration tests

These scenarios and fixtures moved from `lvce-editor` to `lvce-editor/main-area-worker`. The Integration workflow overlays this repository's build in a pinned, disposable LVCE checkout and runs the application's existing test runner.

The workflow preserves the original CI commands, settings, and platform restrictions. Scenarios that were outside the application's CI selection remain available for local runs; their existing skip declarations are unchanged. Repositories with no previously selected CI scenarios expose a manual Integration workflow.

Build this repository, install the pinned application's dependencies and Chromium, then run:

```sh
node packages/e2e-integration/prepare.mjs /path/to/disposable/lvce-editor
cd /path/to/disposable/lvce-editor/packages/extension-host-worker-tests
npm run e2e:headless --
```

To prepare only scenarios whose filenames contain a given substring, pass it as the second argument to `prepare.mjs`.

Preparation replaces the disposable application's scenarios and fixtures and overlays local build artifacts. See `config.json` for artifact and script destinations, and `.github/workflows/integration.yml` for static export, Electron, and settings requirements. Update the pinned application commit when its runtime needs updating.

The PR workflow also runs `scripts/test-move-to-new-window.mjs` in real Electron on Linux, macOS, and Windows against its pinned application runtime. It covers typed process-explorer and heap-snapshot inputs, saved/dirty/untitled text, selection, content-only layout, destination failure, and window lifetime. Run it with a disposable application checkout:

```sh
npm run build
xvfb-run -a node packages/e2e-integration/scripts/test-move-to-new-window.mjs /path/to/disposable/lvce-editor
```

The script overlays the local worker build by default. Set `LVCE_MOVE_USE_PUBLISHED_WORKER=1` to validate the application's installed dependency instead. Every launch uses an isolated Chromium and XDG profile, and optional `LVCE_MOVE_EVIDENCE_DIR` saves screenshots.
