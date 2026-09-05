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
  if (source.includes('debugSelectionTrace:')) {
    return source
  }
  return replaceOnce(
    source,
    '  getActiveEditorId: getActiveEditorId,',
    "  debugSelectionTrace: () => actualInvoke('DualIdeDebug.getSelectionTrace'),\n  getActiveEditorId: getActiveEditorId,",
  )
}
