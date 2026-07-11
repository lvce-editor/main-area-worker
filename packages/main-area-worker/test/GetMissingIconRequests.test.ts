import { expect, test } from '@jest/globals'
import type { Tab } from '../src/parts/Tab/Tab.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getMissingIconRequestsForTabs } from '../src/parts/GetMissingIconRequests/GetMissingIconRequests.ts'

test('getMissingIconRequestsForTabs should request file icons by basename', () => {
  const tabs: readonly Tab[] = [
    {
      editorType: 'text',
      editorUid: -1,
      icon: '',
      id: 1,
      isDirty: false,
      isPreview: false,
      title: 'index.ts',
      uri: '/workspace/src/index.ts',
    },
  ]

  expect(getMissingIconRequestsForTabs(tabs, {})).toEqual([
    {
      name: 'index.ts',
      path: '/workspace/src/index.ts',
      type: DirentType.File,
    },
  ])
})

test('getMissingIconRequestsForTabs should skip extension detail icons', () => {
  const tabs: readonly Tab[] = [
    {
      editorInput: {
        extensionId: 'builtin.theme-ayu',
        type: 'extension-detail-view',
      },
      editorType: 'custom',
      editorUid: -1,
      icon: '',
      id: 1,
      isDirty: false,
      isPreview: false,
      title: 'builtin.theme-ayu',
      uri: 'extension-detail://builtin.theme-ayu',
    },
  ]

  expect(getMissingIconRequestsForTabs(tabs, {})).toEqual([])
})

test('getMissingIconRequestsForTabs should skip running extensions icons', () => {
  const tabs: readonly Tab[] = [
    {
      editorInput: {
        type: 'running-extensions',
      },
      editorType: 'custom',
      editorUid: -1,
      icon: '',
      id: 1,
      isDirty: false,
      isPreview: false,
      title: 'Running Extensions',
      uri: 'running-extensions://',
    },
  ]

  expect(getMissingIconRequestsForTabs(tabs, {})).toEqual([])
})

test('getMissingIconRequestsForTabs should skip cached icons', () => {
  const tabs: readonly Tab[] = [
    {
      editorType: 'text',
      editorUid: -1,
      icon: 'cached-icon',
      id: 1,
      isDirty: false,
      isPreview: false,
      title: 'index.ts',
      uri: '/workspace/src/index.ts',
    },
  ]

  expect(getMissingIconRequestsForTabs(tabs, { '/workspace/src/index.ts': 'cached-icon' })).toEqual([])
})
