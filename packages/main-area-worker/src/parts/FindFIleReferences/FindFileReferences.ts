/* eslint-disable no-console */
export const findFileReferences = (state: any): any => {
  const { activeGroupIndex, groups } = state
  if (activeGroupIndex === -1) {
    return state
  }
  const group = groups[activeGroupIndex]
  const { activeIndex } = group
  const editor = group.editors[activeIndex]
  const { uri } = editor
  // TODO show references view

  console.log('show refrences', uri)
  return state
}
