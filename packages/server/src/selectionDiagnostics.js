const replaceOnce = (source, before, after) => {
  if (source.split(before).length !== 2) {
    throw new Error('selection diagnostic target is not unique: ' + before)
  }
  return source.replace(before, after)
}

export const patchEditorSelectionDiagnostics = (source) => {
  if (source.includes('___selectionTrace')) {
    return source
  }
  const setup = `const selectionTrace = globalThis.___selectionTrace = [];
const recordSelectionTrace = (command, editor, extra) => {
  selectionTrace.push({
    sequence: selectionTrace.length,
    time: performance.now(),
    command,
    uid: editor?.uid,
    uri: editor?.uri,
    selections: Array.from(editor?.selections || []),
    extra
  });
};
`
  source = setup + source
  source = replaceOnce(
    source,
    '    const commandResult = await fn(state, ...args);',
    '    recordSelectionTrace(fn.name, state);\n    const commandResult = await fn(state, ...args);',
  )
  source = replaceOnce(
    source,
    '  const newEditor = setSelections$2(editor, selections);',
    "  recordSelectionTrace('setSelections2', editor, Array.from(selections));\n  const newEditor = setSelections$2(editor, selections);",
  )
  source = replaceOnce(
    source,
    "  'Editor.create2': createEditor2,",
    "  'DualIdeDebug.getSelectionTrace': () => selectionTrace,\n  'Editor.create2': createEditor2,",
  )
  return source
}

export const patchRendererSelectionDiagnostics = (source) => {
  if (source.includes('___rendererFocusTrace')) {
    return source
  }
  source = `const rendererFocusTrace = globalThis.___rendererFocusTrace = [];\n` + source
  source = replaceOnce(
    source,
    '  state$x.focusedInstanceByType[moduleId] = uid;',
    `  rendererFocusTrace.push({ command: 'focus', uid, moduleId, previous: { ...state$x.focusedInstanceByType }, stack: new Error().stack });
  state$x.focusedInstanceByType[moduleId] = uid;`,
  )
  source = replaceOnce(
    source,
    'const updateDynamicFocusContext = commands => {',
    `const updateDynamicFocusContext = commands => {
  rendererFocusTrace.push({ command: 'render', commands: commands.filter(command => command[0] === 'Viewlet.setFocusContext') });`,
  )
  source = replaceOnce(
    source,
    '    const result = await runFn(activeInstance, id, key, fn$1, args);',
    `    if (key === 'selectAll') rendererFocusTrace.push({ command: 'selectAll', id, uid: activeInstance?.state.uid, focused: { ...state$x.focusedInstanceByType } });
    const result = await runFn(activeInstance, id, key, fn$1, args);`,
  )
  if (source.includes('debugSelectionTrace:')) {
    source = replaceOnce(source, "  debugSelectionTrace: () => actualInvoke('DualIdeDebug.getSelectionTrace'),\n", '')
  }
  return replaceOnce(
    source,
    '  getActiveEditorId: getActiveEditorId,',
    "  debugSelectionTrace: async () => ({ editor: await actualInvoke('DualIdeDebug.getSelectionTrace'), renderer: rendererFocusTrace }),\n  getActiveEditorId: getActiveEditorId,",
  )
}

export const patchRendererCommandTarget = (source) => {
  const before = `  if (instance.factory && instance.factory.hasFunctionalRender) {
    const oldState = instance.state;
    const newState = await fn(oldState, ...args);`
  if (source.includes('  id = instance.state.uid;\n' + before)) {
    return source
  }
  return replaceOnce(source, before, `  id = instance.state.uid;
${before}
    if (getByUid(id) !== instance) {
      return;
    }`)
}
