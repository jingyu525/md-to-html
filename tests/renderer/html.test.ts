import { renderHTML } from '../../src/renderer/html'
import type { PlatformNode } from '../../src/types'

describe('Renderer', () => {
  describe('renderHTML', () => {
    it('should render root node', () => {
      const ast: PlatformNode = {
        type: 'root',
        children: []
      }
      const result = renderHTML(ast)
      expect(result).toBe('')
    })

    it('should render heading div', () => {
      const ast: PlatformNode = {
        type: 'div',
        tag: 'div',
        level: 2,
        children: [{ type: 'text', value: 'Heading' }]
      }
      const result = renderHTML(ast)
      expect(result).toContain('<div style=')
      expect(result).toContain('Heading')
      expect(result).toContain('</div>')
    })

    it('should render paragraph', () => {
      const ast: PlatformNode = {
        type: 'p',
        children: [{ type: 'text', value: 'Paragraph' }]
      }
      const result = renderHTML(ast)
      expect(result).toContain('<p style=')
      expect(result).toContain('Paragraph')
      expect(result).toContain('</p>')
    })

    it('should render text', () => {
      const ast: PlatformNode = {
        type: 'text',
        value: 'Text content'
      }
      const result = renderHTML(ast)
      expect(result).toBe('Text content')
    })

    it('should render inline code with HTML escaping', () => {
      const ast: PlatformNode = {
        type: 'inlineCode',
        value: '<script>'
      }
      const result = renderHTML(ast)
      expect(result).toContain('&lt;script&gt;')
    })

    it('should render emphasis', () => {
      const ast: PlatformNode = {
        type: 'emphasis',
        children: [{ type: 'text', value: 'text' }]
      }
      const result = renderHTML(ast)
      expect(result).toBe('<em>text</em>')
    })

    it('should render strong', () => {
      const ast: PlatformNode = {
        type: 'strong',
        children: [{ type: 'text', value: 'text' }]
      }
      const result = renderHTML(ast)
      expect(result).toBe('<strong>text</strong>')
    })

    it('should render code block', () => {
      const ast: PlatformNode = {
        type: 'codeblock',
        value: 'const x = 1;',
        lang: 'javascript'
      }
      const result = renderHTML(ast)
      expect(result).toContain('<table style=')
      expect(result).toContain('<pre style=')
      expect(result).toContain('const x = 1;')
    })

    it('should render unordered list', () => {
      const ast: PlatformNode = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ type: 'text', value: 'Item 1' }]
          }
        ]
      }
      const result = renderHTML(ast)
      expect(result).toContain('<ul style=')
      expect(result).toContain('<li style=')
      expect(result).toContain('Item 1')
    })

    it('should render ordered list', () => {
      const ast: PlatformNode = {
        type: 'ol',
        children: [
          {
            type: 'li',
            children: [{ type: 'text', value: 'Item 1' }]
          }
        ]
      }
      const result = renderHTML(ast)
      expect(result).toContain('<ol style=')
      expect(result).toContain('<li style=')
    })

    it('should render image', () => {
      const ast: PlatformNode = {
        type: 'image',
        url: 'https://example.com/image.png',
        alt: 'Alt text'
      }
      const result = renderHTML(ast)
      expect(result).toContain('<img')
      expect(result).toContain('src="https://example.com/image.png"')
      expect(result).toContain('alt="Alt text"')
    })

    it('should render table', () => {
      const ast: PlatformNode = {
        type: 'table',
        children: [
          {
            type: 'tableRow',
            isHeader: true,
            children: [
              {
                type: 'tableCell',
                children: [{ type: 'text', value: 'Col 1' }]
              }
            ]
          }
        ]
      }
      const result = renderHTML(ast)
      expect(result).toContain('<div style=')
      expect(result).toContain('Col 1')
    })

    it('should render link', () => {
      const ast: PlatformNode = {
        type: 'link',
        url: 'https://example.com',
        children: [{ type: 'text', value: 'Link text' }]
      }
      const result = renderHTML(ast)
      expect(result).toContain('<a href="https://example.com"')
      expect(result).toContain('Link text</a>')
    })

    it('should render blockquote', () => {
      const ast: PlatformNode = {
        type: 'blockquote',
        children: [{ type: 'text', value: 'Quote' }]
      }
      const result = renderHTML(ast)
      expect(result).toContain('<div style=')
      expect(result).toContain('Quote')
    })

    it('should render thematic break', () => {
      const ast: PlatformNode = {
        type: 'thematicBreak'
      }
      const result = renderHTML(ast)
      expect(result).toContain('<div style=')
      expect(result).toContain('</div>')
    })

    it('should render delete', () => {
      const ast: PlatformNode = {
        type: 'delete',
        children: [{ type: 'text', value: 'deleted' }]
      }
      const result = renderHTML(ast)
      expect(result).toBe('<s>deleted</s>')
    })

    it('should escape HTML in text nodes', () => {
      const ast: PlatformNode = {
        type: 'p',
        children: [{ type: 'text', value: '<script>alert("xss")</script>' }]
      }
      const result = renderHTML(ast)
      const plainText = result.replace(/<[^>]*>/g, '').trim()
      expect(plainText).toContain('&lt;script&gt;')
      expect(plainText).toContain('&quot;xss&quot;')
    })

    it('should handle unknown node types', () => {
      const ast: any = {
        type: 'unknownType'
      }
      const result = renderHTML(ast)
      expect(result).toBe('')
    })
  })
})
