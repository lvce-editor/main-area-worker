import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'

export default [
  ...config.default,
  ...config.recommendedVirtualDom,
  ...config.recommendedRegex,
  ...actions.default,
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
    files: ['packages/e2e/**/*.ts'],
    rules: {
      'virtual-dom/prefer-merge-class-names': 'off',
    },
  },
]
