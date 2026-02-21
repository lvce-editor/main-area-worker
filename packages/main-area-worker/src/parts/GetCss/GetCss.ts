export const getCss = (): string => {
  const rules = [
    `.MainArea {
}`,
    `.editor-groups-container {
  position: relative;
}`,
    `.Sash {
  position: absolute;
  z-index: 1;
}`,
    `.SashVertical {
  top: 0;
  bottom: 0;
  width: 0;
  cursor: col-resize;
}`,
    `.SashVertical:hover {
  width: 4px;
  margin-left: -2px;
}`,
    `.SashHorizontal {
  left: 0;
  right: 0;
  height: 0;
  cursor: row-resize;
}`,
    `.SashHorizontal:hover {
  height: 4px;
  margin-top: -2px;
}`,
  ]
  const css = rules.join('\n')
  return css
}
