// @ts-nocheck
import * as Assert from '../Assert/Assert.ts'
import * as Id from '../Id/Id.js'
import * as PathDisplay from '../PathDisplay/PathDisplay.js'
import * as TabFlags from '../TabFlags/TabFlags.js'
import * as ViewletMainFocusIndex from './ViewletMainFocusIndex.ts'

export const openUri = async (state, uri, focus = true, { preview = false, ...context } = {}) => {
  Assert.object(state)
  Assert.string(uri)
  const { activeGroupIndex, groups, tabFontFamily, tabFontSize, tabFontWeight, tabHeight, tabLetterSpacing } = state
  const { x } = state
  const y = state.y + tabHeight
  const { width } = state
  const contentHeight = state.height - tabHeight
  // @ts-ignore
  const moduleId = await ViewletMap.getModuleId(uri, context.opener)
  let activeGroup = groups[activeGroupIndex]
  activeGroup ||= {
    activeIndex: -1,
    editors: [],
    focusedIndex: -1,
    height: state.height,
    tabsUid: Id.create(),
    uid: Id.create(),
    width,
    x,
    y: 0,
  }
  const { activeIndex, editors } = activeGroup

  const previousEditor = editors[activeIndex]
  let disposeCommands
  // @ts-ignore
  if (previousEditor && previousEditor.uri === uri && previousEditor.opener === context.opener) {
    return {
      commands: [],
      newState: state,
    }
  }
  for (let i = 0; i < editors.length; i++) {
    const editor = editors[i]
    if (
      editor.uri === uri && // @ts-ignore
      editor.opener === context.opener
    ) {
      return ViewletMainFocusIndex.focusIndex(state, i)
    }
  }
  // TODO editor needs to be disposed when closing
  //  other tabs and closing all tabs
  if (previousEditor) {
    const previousUid = previousEditor.uid
    disposeCommands = Viewlet.hideFunctional(previousUid)
  }
  const instanceUid = Id.create()
  const instance = ViewletManager.create(ViewletModule.load, moduleId, state.uid, uri, activeGroup.x, y, activeGroup.width, contentHeight)
  instance.uid = instanceUid
  // const oldActiveIndex = state.activeIndex
  const tabLabel = PathDisplay.getLabel(uri)
  const tabWidth = MeasureTabWidth.measureTabWidth(tabLabel, tabFontWeight, tabFontSize, tabFontFamily, tabLetterSpacing)
  const tabTitle = PathDisplay.getTitle(uri)
  const icon = PathDisplay.getFileIcon(uri)
  const newEditor = {
    flags: TabFlags.Preview,
    icon,
    label: tabLabel,
    moduleId,
    tabWidth,
    title: tabTitle,
    uid: instanceUid,
    uri,
  }
  const newEditors = [...activeGroup.editors, newEditor]
  const newActiveIndex = newEditors.length - 1
  const newGroup = { ...activeGroup, activeIndex: newActiveIndex, editors: newEditors }
  const newGroups = [...groups.slice(0, activeGroupIndex), newGroup, ...groups.slice(activeGroupIndex + 1)]
  // @ts-ignore
  instance.show = false
  instance.setBounds = false
  ViewletStates.setState(state.uid, {
    ...state,
    activeGroupIndex: 0,
    groups: newGroups,
    pendingUid: instanceUid,
  })
  if (context) {
    instance.args = [context]
  }
  // @ts-ignore
  const commands = await ViewletManager.load(instance, focus)
  commands.push(['Viewlet.setBounds', instanceUid, activeGroup.x, tabHeight, activeGroup.width, contentHeight])
  let { tabsUid } = state
  if (tabsUid === -1) {
    tabsUid = Id.create()
  }
  if (disposeCommands) {
    commands.push(...disposeCommands)
  }
  commands.push(['Viewlet.append', state.uid, instanceUid])
  if (focus) {
    commands.push(['Viewlet.focus', instanceUid])
  }
  const latestState = ViewletStates.getState(state.uid)
  const latestPendingUid = latestState.pendingUid
  if (latestPendingUid !== instanceUid) {
    return {
      commands: [],
      newState: state,
    }
  }
  if (!ViewletStates.hasInstance(instanceUid)) {
    return {
      commands,
      newState: state,
    }
  }
  return {
    commands,
    newState: {
      ...state,
      groups: newGroups,
      tabsUid,
    },
  }
}
