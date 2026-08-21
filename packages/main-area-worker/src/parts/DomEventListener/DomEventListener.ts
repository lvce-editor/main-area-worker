export interface DomEventListener {
  readonly dragEffect?: string
  readonly name: string | number
  readonly params: readonly (string | number)[]
  readonly passive?: boolean
  readonly preventDefault?: boolean
  readonly stopPropagation?: boolean
  readonly trackPointerEvents?: any
}
