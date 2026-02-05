import { parseMarkdown } from '../../src/parser/markdown'
import { wechatAdapter } from '../../src/adapter/wechat'
import { renderHTML } from '../../src/renderer/html'
import { theme as defaultTheme } from '../../src/theme/wechat-default'

// Mock the parser to handle mermaid code blocks
jest.mock('../../src/parser/markdown', () => {
  const originalModule = jest.requireActual('../../__mocks__/parser')
  return {
    parseMarkdown: originalModule.parseMarkdown
  }
})


describe('Mermaid E2E Tests', () => {
  it('should render mermaid diagram from markdown', async () => {
    const markdown = `
# Flowchart Example

Here is a simple flowchart:

\`\`\`mermaid
graph TD
  A[Start] --> B{Decision}
  B -->|Yes| C[OK]
  B -->|No| D[Cancel]
  C --> E[End]
  D --> E
\`\`\`

End of document.
    `
    const mdast = parseMarkdown(markdown)
    const wechatAst = wechatAdapter(mdast)
    const html = await renderHTML(wechatAst, defaultTheme)

    expect(html).toContain('<img src="data:image/svg+xml;base64,')
    expect(html).toContain('alt="Mermaid Diagram"')
    expect(html).toContain('Flowchart Example')
  })

  it('should render multiple mermaid diagrams', async () => {
    const markdown = `
# Diagram 1

\`\`\`mermaid
graph LR
  A --> B
\`\`\`

# Diagram 2

\`\`\`mermaid
sequenceDiagram
  Alice->>Bob: Hello
\`\`\`
    `
    const mdast = parseMarkdown(markdown)
    const wechatAst = wechatAdapter(mdast)
    const html = await renderHTML(wechatAst, defaultTheme)

    const svgCount = (html.match(/data:image\/svg\+xml;base64/g) || []).length
    expect(svgCount).toBe(2)
  })

  it('should handle mermaid rendering error gracefully', async () => {
    const markdown = `
# Invalid Mermaid

\`\`\`mermaid
invalid mermaid syntax here
\`\`\`
    `
    const mdast = parseMarkdown(markdown)
    const wechatAst = wechatAdapter(mdast)
    const html = await renderHTML(wechatAst, defaultTheme)

    expect(html).toContain('Mermaid 图表渲染失败')
  })

  it('should render mermaid with mixed content', async () => {
    const markdown = `
# Mixed Content

This is a paragraph.

\`\`\`mermaid
graph TD
  A --> B
\`\`\`

- List item 1
- List item 2

**Bold text**
    `
    const mdast = parseMarkdown(markdown)
    const wechatAst = wechatAdapter(mdast)
    const html = await renderHTML(wechatAst, defaultTheme)

    expect(html).toContain('Mixed Content')
    expect(html).toContain('<img src="data:image/svg+xml;base64,')
    expect(html).toContain('List item 1')
    expect(html).toContain('<strong>Bold text</strong>')
  })
})
