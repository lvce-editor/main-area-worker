import * as config from '@lvce-editor/eslint-config'

export default [
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
    files: ['packages/e2e/tsconfig.json'],
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
    files: ['packages/e2e/**/*.ts'],
    rules: {
      'virtual-dom/prefer-merge-class-names': 'off',
    },
  },
]
