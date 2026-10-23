import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'

export default defineConfig([
  ...config.default,
  ...config.recommendedVirtualDom,
  ...config.recommendedActions,
  ...config.recommendedTsconfig,
  ...config.recommendedRegex,
  {
    rules: {
      '@cspell/spellchecker': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  {
    files: ['packages/main-area-worker/src/**/*.ts'],
    rules: {
      'virtual-dom/prefer-state-destructuring': 'off',
    },
  },
  {
    files: ['packages/{e2e,e2e-integration}/tsconfig.json'],
    rules: {
      'tsconfig/allow-importing-ts-extensions': 'off',
      'tsconfig/dont-skip-lib-check': 'off',
      'tsconfig/exact-optional-property-types': 'off',
      'tsconfig/force-consistent-casing-in-file-names': 'off',
      'tsconfig/no-implicit-any': 'off',
      'tsconfig/no-unchecked-side-effect-imports': 'off',
    },
  },
  {
    files: ['packages/main-area-worker/tsconfig.json'],
    rules: {
      'tsconfig/dont-skip-lib-check': 'off',
      'tsconfig/exact-optional-property-types': 'off',
    },
  },
  {
    files: [
      'packages/main-area-worker/src/parts/GetMainAreaVirtualDom/GetMainAreaVirtualDom.ts',
      'packages/main-area-worker/src/parts/RenderEditorGroup/RenderEditorGroup.ts',
      'packages/main-area-worker/src/parts/RenderEmptyEditorGroup/RenderEmptyEditorGroup.ts',
    ],
    rules: {
      'virtual-dom/no-inline-style': 'off',
    },
  },
  {
    files: ['packages/main-area-worker/test/**/*.ts'],
    rules: {
      'virtual-dom/no-inline-style': 'off',
      'virtual-dom/prefer-constants': 'off',
      'virtual-dom/prefer-merge-class-names': 'off',
      'virtual-dom/prefer-state-destructuring': 'off',
      'virtual-dom/valid-child-count': 'off',
    },
  },
  {
    files: ['packages/{e2e,e2e-integration}/**/*.ts'],
    rules: {
      'virtual-dom/prefer-merge-class-names': 'off',
    },
  },
  {
    // The pinned application supplies its own Node runtime.
    files: ['.github/workflows/integration.yml'],
    rules: { 'github-actions/node-version-file': 'off', 'github-actions/on': 'off' },
  },
  {
    // Preserve real DOM input events covered by the migrated application scenarios.
    files: [
      'packages/e2e-integration/src/viewlet.main-same-file-undo-redo.ts',
      'packages/e2e-integration/src/viewlet.main-same-file-three-groups-vertical.ts',
      'packages/e2e-integration/src/viewlet.main-same-file-three-groups-horizontal.ts',
      'packages/e2e-integration/src/viewlet.main-same-file-save-from-other-group.ts',
      'packages/e2e-integration/src/viewlet.main-same-file-open-after-unsaved-edit.ts',
      'packages/e2e-integration/src/viewlet.main-same-file-one-hundred-groups.ts',
      'packages/e2e-integration/src/viewlet.main-same-file-one-hundred-groups-vertical.ts',
      'packages/e2e-integration/src/viewlet.main-same-file-multiline-edit.ts',
      'packages/e2e-integration/src/viewlet.main-same-file-mixed-layout.ts',
      'packages/e2e-integration/src/viewlet.main-same-file-many-groups-isolate-other-file.ts',
      'packages/e2e-integration/src/viewlet.main-same-file-many-groups-bidirectional.ts',
      'packages/e2e-integration/src/viewlet.main-same-file-edit-right.ts',
      'packages/e2e-integration/src/viewlet.main-same-file-edit-left.ts',
      'packages/e2e-integration/src/viewlet.main-same-file-edit-bidirectional.ts',
      'packages/e2e-integration/src/viewlet.main-same-file-close-one-of-many.ts',
      'packages/e2e-integration/src/viewlet.main-open-not-found-create-file.ts',
      'packages/e2e-integration/src/viewlet.main-long-tab-title.ts',
    ],
    rules: { '@typescript-eslint/no-deprecated': 'off' },
  },
])
