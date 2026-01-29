import { expect, test } from '@jest/globals'
import type { IconRequest } from '../src/parts/IconRequest/IconRequest.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { toSimpleIconRequest } from '../src/parts/ToSimpleIconRequest/ToSimpleIconRequest.ts'

test('should convert file icon request to simple format', () => {
  const request: IconRequest = {
    name: 'example.ts',
    path: '/home/user/example.ts',
    type: DirentType.File,
  }

  const result = toSimpleIconRequest(request)

  expect(result).toEqual({
    name: 'example.ts',
    type: 1,
  })
})

test('should convert directory icon request to simple format', () => {
  const request: IconRequest = {
    name: 'src',
    path: '/home/user/src',
    type: DirentType.Directory,
  }

  const result = toSimpleIconRequest(request)

  expect(result).toEqual({
    name: 'src',
    type: 2,
  })
})

test('should convert expanded directory icon request to simple format', () => {
  const request: IconRequest = {
    name: 'src',
    path: '/home/user/src',
    type: DirentType.DirectoryExpanded,
  }

  const result = toSimpleIconRequest(request)

  expect(result).toEqual({
    name: 'src',
    type: 2,
  })
})

test('should map various file types to type 1', () => {
  const fileTypes = [
    DirentType.BlockDevice,
    DirentType.CharacterDevice,
    DirentType.Fifo,
    DirentType.Socket,
    DirentType.Symlink,
    DirentType.SymLinkFile,
    DirentType.SymLinkFolder,
    DirentType.Unknown,
  ]

  for (const fileType of fileTypes) {
    const request: IconRequest = {
      name: 'test',
      path: '/test',
      type: fileType,
    }

    const result = toSimpleIconRequest(request)

    expect(result.type).toBe(1)
  }
})

test('should preserve the name property', () => {
  const names = ['file.js', 'folder', 'README.md', '.gitignore', 'node_modules']

  for (const name of names) {
    const request: IconRequest = {
      name,
      path: `/some/path/${name}`,
      type: DirentType.File,
    }

    const result = toSimpleIconRequest(request)

    expect(result.name).toBe(name)
  }
})

test('should ignore the path property in the result', () => {
  const request: IconRequest = {
    name: 'example.ts',
    path: '/very/long/path/to/example.ts',
    type: DirentType.File,
  }

  const result = toSimpleIconRequest(request)

  expect(result).not.toHaveProperty('path')
  expect(result).toEqual({
    name: 'example.ts',
    type: 1,
  })
})
