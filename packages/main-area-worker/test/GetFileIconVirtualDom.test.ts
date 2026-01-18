import { expect, test } from '@jest/globals'
import { AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as GetFileIconVirtualDom from '../src/parts/GetFileIconVirtualDom/GetFileIconVirtualDom.ts'

test('getFileIconVirtualDom should return correct VirtualDomNode structure', () => {
  const icon: string = 'test-icon.png'
  const result: ReturnType<typeof GetFileIconVirtualDom.getFileIconVirtualDom> = GetFileIconVirtualDom.getFileIconVirtualDom(icon)
  expect(result).toEqual({
    childCount: 0,
    className: ClassNames.FileIcon,
    role: AriaRoles.None,
    src: icon,
    type: VirtualDomElements.Img,
  })
})

test('getFileIconVirtualDom should use provided icon as src', () => {
  const icon: string = 'custom-icon.svg'
  const result: ReturnType<typeof GetFileIconVirtualDom.getFileIconVirtualDom> = GetFileIconVirtualDom.getFileIconVirtualDom(icon)
  expect(result.src).toBe(icon)
})

test('getFileIconVirtualDom should have correct type and role', () => {
  const icon: string = 'any-icon.png'
  const result: ReturnType<typeof GetFileIconVirtualDom.getFileIconVirtualDom> = GetFileIconVirtualDom.getFileIconVirtualDom(icon)
  expect(result.type).toBe(VirtualDomElements.Img)
  expect(result.role).toBe(AriaRoles.None)
})

test('getFileIconVirtualDom should have correct className', () => {
  const icon: string = 'test-icon.png'
  const result: ReturnType<typeof GetFileIconVirtualDom.getFileIconVirtualDom> = GetFileIconVirtualDom.getFileIconVirtualDom(icon)
  expect(result.className).toBe(ClassNames.FileIcon)
})

test('getFileIconVirtualDom should have childCount of 0', () => {
  const icon: string = 'test-icon.png'
  const result: ReturnType<typeof GetFileIconVirtualDom.getFileIconVirtualDom> = GetFileIconVirtualDom.getFileIconVirtualDom(icon)
  expect(result.childCount).toBe(0)
})

test('getFileIconVirtualDom should handle empty string icon', () => {
  const icon: string = ''
  const result: ReturnType<typeof GetFileIconVirtualDom.getFileIconVirtualDom> = GetFileIconVirtualDom.getFileIconVirtualDom(icon)
  expect(result.src).toBe('')
  expect(result.type).toBe(VirtualDomElements.Img)
  expect(result.className).toBe(ClassNames.FileIcon)
})
