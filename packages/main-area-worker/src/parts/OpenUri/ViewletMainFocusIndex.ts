// @ts-nocheck

import * as Assert from '../Assert/Assert.ts'
import * as Id from '../Id/Id.ts'

export const focusIndex = async (state: any, index: number): Promise<any> => {
  const { activeGroupIndex, groups, tabHeight, uid } = state
  const group = groups[activeGroupIndex]
  const { editors } = group
  const oldActiveIndex = group.activeIndex
  if (index === oldActiveIndex) {
    return {
      commands: [],
      newState: state,
    }
  }
  const newGroup = { ...group, activeIndex: index }
  const newGroups = [...groups.slice(0, activeGroupIndex), newGroup, ...groups.slice(activeGroupIndex + 1)]
  const newState = {
    ...state,
    groups: newGroups,
  }
  const editor = editors[index]
  const { x } = group
  const y = group.y + tabHeight
  const { width } = group
  const contentHeight = group.height - tabHeight
  const id = await ViewletMap.getModuleId(editor.uri)

  const oldEditor = editors[oldActiveIndex]
  const oldId = await ViewletMap.getModuleId(oldEditor.uri)

  const oldInstance = ViewletStates.getInstance(oldId)

  const previousUid = oldEditor.uid
  Assert.number(previousUid)
  const disposeCommands = Viewlet.disposeFunctional(previousUid)

  const maybeHiddenEditorInstance = ViewletStates.getInstance(editor.uid)
  if (maybeHiddenEditorInstance) {
    const commands = Viewlet.showFunctional(editor.uid)
    const allCommands = [...disposeCommands, ...commands]
    return {
      commands: allCommands,
      newState,
    }
  }

  const instanceUid = Id.create()
  const instance = ViewletManager.create(ViewletModule.load, id, uid, editor.uri, x, y, width, contentHeight)
  instance.show = false
  instance.setBounds = false
  instance.uid = instanceUid
  editor.uid = instanceUid

  const resizeCommands = ['Viewlet.setBounds', instanceUid, x, tabHeight, width, contentHeight]

  const commands = await ViewletManager.load(instance)

  commands.unshift(...disposeCommands)

  commands.push(resizeCommands)

  commands.push(['Viewlet.append', uid, instanceUid])
  return {
    commands,
    newState,
  }
}

const focus = (state, getIndex): any => {
  const { activeGroupIndex, groups } = state
  const group = groups[activeGroupIndex]
  const { activeIndex, editors } = group
  const index = getIndex(editors, activeIndex)
  return focusIndex(state, index)
}

const getFirstindex = (): number => {
  return 0
}

export const focusFirst = (state): any => {
  return focus(state, getFirstindex)
}

const getLastIndex = (editors): number => {
  return editors.length - 1
}

export const focusLast = (state): any => {
  return focus(state, getLastIndex)
}

const getPreviousIndex = (editors, activeIndex): number => {
  return activeIndex === 0 ? editors.length - 1 : activeIndex - 1
}

export const focusPrevious = (state): any => {
  return focus(state, getPreviousIndex)
}

const getNextIndex = (editors, activeIndex): number => {
  return activeIndex === editors.length - 1 ? 0 : activeIndex + 1
}

export const focusNext = (state): any => {
  return focus(state, getNextIndex)
}

// TODO make computation more efficient
const getIsCloseButton = (tabs, index, eventX, x): number => {
  let total = 0
  for (let i = 0; i <= index; i++) {
    total += tabs[index].tabWidth
  }

  const tab = tabs[index]
  const offset = eventX - x - total
  const closeButtonWidth = 23
  return -offset < closeButtonWidth
}

export const handleTabClick = (state, button, eventX, eventY): any => {
  Assert.number(button)
  Assert.number(eventX)
  Assert.number(eventY)
  const { activeGroupIndex, groups } = state
  const group = groups[activeGroupIndex]

  const { editors, x, y } = group
  const index = GetTabIndex.getTabIndex(editors, x, eventX)
  if (index === -1) {
    return state
  }
  const isCloseButton = getIsCloseButton(editors, index, eventX, x)
  if (isCloseButton) {
    return closeEditor(state, index)
  }
  switch (button) {
    case MouseEventType.LeftClick:
      return focusIndex(state, index)
    case MouseEventType.MiddleClick:
      return closeEditor(state, index)
    default:
      return state
  }
}
