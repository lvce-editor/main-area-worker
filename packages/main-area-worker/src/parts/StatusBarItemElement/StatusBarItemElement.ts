export type StatusBarItemElement =
  | {
      readonly type: 'text'
      readonly value: string
    }
  | {
      readonly type: 'icon'
      readonly value: string
    }
