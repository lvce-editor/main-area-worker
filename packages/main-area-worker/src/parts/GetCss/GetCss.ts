export const getCss = (): string => {
  const rules = [
    `.MainArea {
}`,
    `.editor-groups-container {
  overflow: auto;
}`,

    `.EditorGroup {
  min-width: 250px;
}`,
  ]
  const css = rules.join('\n')
  return css
}
