export const CSS_CLASSES = {
  CUSTOM_EDITOR: 'custom-editor',
  DRAGGING: 'dragging',
  DROP_TARGET: 'drop-target',
  EDITOR_CONTAINER: 'editor-container',
  EDITOR_CONTENT: 'editor-content',
  EDITOR_GROUP: 'editor-group',
  EDITOR_GROUP_FOCUSED: 'focused',
  EDITOR_GROUPS_CONTAINER: 'editor-groups-container',
  EMPTY_EDITOR: 'empty-editor',
  MAIN_AREA: 'main-area',
  TAB: 'tab',
  TAB_ACTIVE: 'active',
  TAB_BAR: 'tab-bar',
  TAB_CLOSE: 'tab-close',
  TAB_TITLE: 'tab-title',
  TEXT_EDITOR: 'text-editor',
} as const

export const CSS_ATTRIBUTES = {
  DATA_ACTION: 'data-action',
  DATA_CUSTOM_EDITOR_ID: 'data-custom-editor-id',
  DATA_DIRECTION: 'data-direction',
  DATA_GROUP_ID: 'data-group-id',
  DATA_LANGUAGE: 'data-language',
  DATA_TAB_ID: 'data-tab-id',
} as const

export const CSS_STYLES = {
  CUSTOM_EDITOR_STYLE: 'flex: 1; overflow: auto;',
  EDITOR_GROUP_BASE: 'display: flex; flex-direction: column; border-right: 1px solid var(--border-color);',
  EDITOR_GROUP_FOCUSED_STYLE: 'box-shadow: 0 0 0 1px var(--focus-border-color);',
  EMPTY_EDITOR_STYLE: 'flex: 1; display: flex; align-items: center; justify-content: center; color: var(--dimmed-color);',
  FLEX_1: 'flex: 1;',
  FLEX_COLUMN: 'display: flex; flex-direction: column; height: 100%;',
  FLEX_ROW: 'display: flex; flex-direction: row; height: 100%;',
  TAB_ACTIVE_STYLE: 'background: var(--tab-active-background); color: var(--tab-active-color);',
  TAB_BAR_BASE: 'display: flex; align-items: center; background: var(--tab-bar-background); border-bottom: 1px solid var(--border-color);',
  TAB_BASE: 'padding: 4px 8px; cursor: pointer; border-right: 1px solid var(--border-color); display: flex; align-items: center; gap: 4px;',
  TAB_CLOSE_HOVER: 'opacity: 1; background: var(--tab-close-hover-background);',
  TAB_CLOSE_STYLE: 'background: none; border: none; cursor: pointer; padding: 2px; border-radius: 2px; opacity: 0.7;',
  TEXT_EDITOR_STYLE: 'flex: 1; overflow: auto; font-family: var(--editor-font-family); font-size: var(--editor-font-size);',
} as const

export const THEMES = {
  DARK: {
    '--border-color': '#3e3e42',
    '--dimmed-color': '#858585',
    '--editor-font-family': 'Consolas, Monaco, "Courier New", monospace',
    '--editor-font-size': '14px',
    '--focus-border-color': '#0078d4',
    '--tab-active-background': '#1e1e1e',
    '--tab-active-color': '#ffffff',
    '--tab-bar-background': '#252526',
    '--tab-close-hover-background': '#3e3e42',
  },
  LIGHT: {
    '--border-color': '#e1e1e1',
    '--dimmed-color': '#999999',
    '--editor-font-family': 'Consolas, Monaco, "Courier New", monospace',
    '--editor-font-size': '14px',
    '--focus-border-color': '#0078d4',
    '--tab-active-background': '#ffffff',
    '--tab-active-color': '#333333',
    '--tab-bar-background': '#f3f3f3',
    '--tab-close-hover-background': '#e1e1e1',
  },
} as const

export const getThemeStyles = (theme: keyof typeof THEMES = 'DARK'): string => {
  const themeVars = THEMES[theme]
  return Object.entries(themeVars)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ')
}
