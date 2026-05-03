import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-syntax-highlighting-core-languages'

export const skip = true

type SyntaxTokenExpectation = {
  readonly className: string
  readonly selector: string
  readonly text: string
}

type SyntaxCase = {
  readonly content: string
  readonly fileName: string
  readonly tokens: readonly SyntaxTokenExpectation[]
}

const syntaxCases: readonly SyntaxCase[] = [
  {
    content: '<div class="greeting">hello</div>',
    fileName: 'syntax-highlight.html',
    tokens: [
      {
        className: 'Token TagName',
        selector: '.TokenTagName',
        text: 'div',
      },
      {
        className: 'Token AttributeName',
        selector: '.TokenAttributeName',
        text: 'class',
      },
    ],
  },
  {
    content: '{"name":"lvce","count":1,"active":true}',
    fileName: 'syntax-highlight.json',
    tokens: [
      {
        className: 'Token JsonPropertyName',
        selector: '.TokenJsonPropertyName',
        text: 'name',
      },
      {
        className: 'Token JsonPropertyValueString',
        selector: '.TokenJsonPropertyValueString',
        text: 'lvce',
      },
      {
        className: 'Token Numeric',
        selector: '.TokenNumeric',
        text: '1',
      },
      {
        className: 'Token LanguageConstant',
        selector: '.TokenLanguageConstant',
        text: 'true',
      },
    ],
  },
]

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  for (const syntaxCase of syntaxCases) {
    const filePath = `${tmpDir}/${syntaxCase.fileName}`
    await FileSystem.writeFile(filePath, syntaxCase.content)

    await Main.openUri(filePath)
    await Editor.shouldHaveText(syntaxCase.content)

    const tab = Locator(`.MainTab[title$="${syntaxCase.fileName}"]`)
    await expect(tab).toBeVisible()

    const editorContent = Locator('.EditorContent')
    await expect(editorContent).toBeVisible()

    const editorRow = Locator('.EditorRow').first()
    await expect(editorRow).toBeVisible()

    for (const tokenExpectation of syntaxCase.tokens) {
      const token = Locator(tokenExpectation.selector, { hasText: tokenExpectation.text }).first()
      await expect(token).toBeVisible()
    }

    await Main.closeAllEditors()
  }
}
