export const Idle = 1
export const Loading = 2
export const Loaded = 3
export const Binary = 4
export const Error = 5
export const Large = 6

export type LoadingState = typeof Idle | typeof Loading | typeof Loaded | typeof Binary | typeof Error | typeof Large
