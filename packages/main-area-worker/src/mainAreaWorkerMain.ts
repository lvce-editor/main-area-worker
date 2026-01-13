import * as Main from './parts/Main/Main.ts'
import * as MainAreaMain from './parts/MainAreaMain/MainAreaMain.ts'

export const main = async (): Promise<void> => {
  await Main.main()
  await MainAreaMain.main()
}

Main.main()
