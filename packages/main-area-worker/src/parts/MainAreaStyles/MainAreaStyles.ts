export const CSS_CLASSES: {
  readonly CUSTOM_EDITOR: 'custom-editor'
  readonly DRAGGING: 'dragging'
  readonly DROP_TARGET: 'drop-target'
  readonly EDITOR_CONTAINER: 'editor-container'
  readonly EDITOR_CONTENT: 'editor-content'
  readonly EDITOR_GROUP: 'editor-group'
  readonly EDITOR_GROUP_FOCUSED: 'focused'
  readonly EDITOR_GROUPS_CONTAINER: 'editor-groups-container'
  readonly EMPTY_EDITOR: 'empty-editor'
  readonly MAIN_AREA: 'main-area'
  readonly TAB: 'tab'
  readonly TAB_ACTIVE: 'active'
  readonly TAB_BAR: 'tab-bar'
  readonly TAB_CLOSE: 'tab-close'
  readonly TAB_TITLE: 'tab-title'
  readonly TEXT_EDITOR: 'text-editor'
} = {
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
}

export const CSS_ATTRIBUTES: {
  readonly DATA_ACTION: 'data-action'
  readonly DATA_CUSTOM_EDITOR_ID: 'data-custom-editor-id'
  readonly DATA_DIRECTION: 'data-direction'
  readonly DATA_GROUP_ID: 'data-group-id'
  readonly DATA_LANGUAGE: 'data-language'
  readonly DATA_TAB_ID: 'data-tab-id'
} = {
  DATA_ACTION: 'data-action',
  DATA_CUSTOM_EDITOR_ID: 'data-custom-editor-id',
  DATA_DIRECTION: 'data-direction',
  DATA_GROUP_ID: 'data-group-id',
  DATA_LANGUAGE: 'data-language',
  DATA_TAB_ID: 'data-tab-id',
}

export const CSS_STYLES: {
  readonly CUSTOM_EDITOR_STYLE: 'flex: 1; overflow: auto;'
  readonly EDITOR_GROUP_BASE: 'display: flex; flex-direction: column; border-right: 1px solid var(--border-color);'
  readonly EDITOR_GROUP_FOCUSED_STYLE: 'box-shadow: 0 0 0 1px var(--focus-border-color);'
  readonly EMPTY_EDITOR_STYLE: 'flex: 1; display: flex; align-items: center; justify-content: center; color: var(--dimmed-color);'
  readonly FLEX_1: 'flex: 1;'
  readonly FLEX_COLUMN: 'display: flex; flex-direction: column; height: 100%;'
  readonly FLEX_ROW: 'display: flex; flex-direction: row; height: 100%;'
  readonly TAB_ACTIVE_STYLE: 'background: var(--tab-active-background); color: var(--tab-active-color);'
  readonly TAB_BAR_BASE: 'display: flex; align-items: center; background: var(--tab-bar-background); border-bottom: 1px solid var(--border-color);'
  readonly TAB_BASE: 'padding: 4px 8px; cursor: pointer; border-right: 1px solid var(--border-color); display: flex; align-items: center; gap: 4px;'
  readonly TAB_CLOSE_HOVER: 'opacity: 1; background: var(--tab-close-hover-background);'
  readonly TAB_CLOSE_STYLE: 'background: none; border: none; cursor: pointer; padding: 2px; border-radius: 2px; opacity: 0.7;'
  readonly TEXT_EDITOR_STYLE: 'flex: 1; overflow: auto; font-family: var(--editor-font-family); font-size: var(--editor-font-size);'
} = {
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
}

export const THEMES: {
  readonly DARK: {
    readonly '--border-color': '#3e3e42'
    readonly '--dimmed-color': '#858585'
    readonly '--editor-font-family': 'Consolas, Monaco, "Courier New", monospace'
    readonly '--editor-font-size': '14px'
    readonly '--focus-border-color': '#0078d4'
    readonly '--tab-active-background': '#1e1e1e'
    readonly '--tab-active-color': '#ffffff'
    readonly '--tab-bar-background': '#252526'
    readonly '--tab-close-hover-background': '#3e3e42'
  }
  readonly LIGHT: {
    readonly '--border-color': '#e1e1e1'
    readonly '--dimmed-color': '#999999'
    readonly '--editor-font-family': 'Consolas, Monaco, "Courier New", monospace'
    readonly '--editor-font-size': '14px'
    readonly '--focus-border-color': '#0078d4'
    readonly '--tab-active-background': '#ffffff'
    readonly '--tab-active-color': '#333333'
    readonly '--tab-bar-background': '#f3f3f3'
    readonly '--tab-close-hover-background': '#e1e1e1'
  }
} = {
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
}

export const getThemeStyles = (theme: keyof typeof THEMES = 'DARK'): string => {
  const themeVars = THEMES[theme]
  return Object.entries(themeVars)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ')
}
