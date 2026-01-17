export const closeTabsRight = async (state: any): Promise<any> => {
  const { activeGroupIndex, groups } = state
  if (activeGroupIndex === -1) {
    return {
      commands: [],
      newState: state,
    }
  }
  const group = groups[activeGroupIndex]
  const { activeIndex, editors, focusedIndex } = group
  const commands = []
  const newEditors = editors.slice(0, focusedIndex + 1)
  if (focusedIndex >= activeIndex) {
    // view is kept the same, only tabs are closed
  } else {
    // view needs to be switched to focused index
    const previousEditor = editors[activeIndex]
    let disposeCommands = []
    if (previousEditor) {
      const previousUid = previousEditor.uid
      // @ts-ignore
      disposeCommands = Viewlet.disposeFunctional(previousUid)
    }
    commands.push(...disposeCommands)
    const newActiveEditor = newEditors[focusedIndex]
    const { x } = state
    const y = state.y + state.tabHeight
    const { width } = state
    const contentHeight = state.height - state.tabHeight
    const { uri } = newActiveEditor
    // TODO ask renderer worker / layout for id
    // @ts-ignore
    const moduleId = await ViewletMap.getModuleId(uri)
    const { uid } = newActiveEditor
    // @ts-ignore
    const instance = ViewletManager.create(ViewletModule.load, moduleId, state.uid, uri, x, y, width, contentHeight)
    // @ts-ignore
    instance.show = false
    instance.setBounds = false
    instance.uid = uid
    const focus = true
    // @ts-ignore
    const instanceCommands = await ViewletManager.load(instance, focus, false, {})
    commands.push(...instanceCommands)
    commands.push(['Viewlet.setBounds', uid, x, state.tabHeight, width, contentHeight])
    commands.push(['Viewlet.append', state.uid, uid])
  }
  const newGroups = [
    ...groups.slice(0, activeGroupIndex),
    {
      ...group,
      activeIndex: focusedIndex,
      editors: newEditors,
    },
    ...groups.slice(activeGroupIndex + 1),
  ]
  return {
    commands,
    newState: {
      ...state,
      groups: newGroups,
    },
  }
}
