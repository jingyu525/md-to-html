import { renderMermaid, clearMermaidCache } from '../../src/renderer/mermaid'

describe('Mermaid Renderer', () => {
  beforeEach(() => {
    clearMermaidCache()
  })

  describe('renderMermaid', () => {
    it('should render simple flowchart', async () => {
      const code = `
        graph TD
          A-->B
      `
      const result = await renderMermaid(code)
      expect(result.error).toBeUndefined()
      expect(result.svg).toContain('<svg')
      expect(result.svg).toContain('</svg>')
    })

    it('should render sequence diagram', async () => {
      const code = `
        sequenceDiagram
          Alice->>Bob: Hello
      `
      const result = await renderMermaid(code)
      expect(result.error).toBeUndefined()
      expect(result.svg).toContain('<svg')
    })

    it('should cache results', async () => {
      const code = `
        graph TD
          A-->B
      `
      const result1 = await renderMermaid(code)
      const result2 = await renderMermaid(code)
      expect(result1.svg).toBe(result2.svg)
    })

    it('should use cache key with theme', async () => {
      const code = `
        graph TD
          A-->B
      `
      const result1 = await renderMermaid(code, { theme: 'default' })
      const result2 = await renderMermaid(code, { theme: 'dark' })
      expect(result1.svg).not.toBe(result2.svg)
    })

    it('should use cache key with backgroundColor', async () => {
      const code = `
        graph TD
          A-->B
      `
      const result1 = await renderMermaid(code, { backgroundColor: 'white' })
      const result2 = await renderMermaid(code, { backgroundColor: 'transparent' })
      expect(result1.svg).not.toBe(result2.svg)
    })

    it('should handle invalid mermaid code', async () => {
      const code = `
        invalid mermaid syntax
      `
      const result = await renderMermaid(code)
      expect(result.error).toBeDefined()
      expect(result.svg).toBe('')
    })

    it('should support custom theme', async () => {
      const code = `
        graph TD
          A-->B
      `
      const result = await renderMermaid(code, { theme: 'dark' })
      expect(result.error).toBeUndefined()
      expect(result.svg).toContain('<svg')
    })
  })

  describe('clearMermaidCache', () => {
    it('should clear the cache', async () => {
      const code = `
        graph TD
          A-->B
      `
      const result1 = await renderMermaid(code)
      clearMermaidCache()
      const result2 = await renderMermaid(code)
      expect(result1.svg).toBe(result2.svg)
    })
  })
})
