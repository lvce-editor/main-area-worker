import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'

export default [
  ...config.default,
  ...actions.default,
  {
    rules: {
      '@cspell/spellchecker': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    },
  },
]
