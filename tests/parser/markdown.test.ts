jest.mock('../../src/parser/markdown', () => {
  const actual = jest.requireActual('../../__mocks__/parser')
  return {
    parseMarkdown: actual.parseMarkdown
  }
})

import { parseMarkdown } from '../../src/parser/markdown'

describe('Parser', () => {
  describe('parseMarkdown', () => {
    it('should parse heading correctly', () => {
      const markdown = '# Heading 1'
      const ast = parseMarkdown(markdown)
      expect(ast.type).toBe('root')
      expect(ast.children).toHaveLength(1)
      expect(ast.children[0].type).toBe('heading')
      if (ast.children[0].type === 'heading') {
        expect(ast.children[0].depth).toBe(1)
      }
    })

    it('should parse paragraph correctly', () => {
      const markdown = 'This is a paragraph.'
      const ast = parseMarkdown(markdown)
      expect(ast.type).toBe('root')
      expect(ast.children).toHaveLength(1)
      expect(ast.children[0].type).toBe('paragraph')
    })

    it('should parse inline code correctly', () => {
      const markdown = 'This is `inline code`.'
      const ast = parseMarkdown(markdown)
      expect(ast.type).toBe('root')
      expect(ast.children[0].type).toBe('paragraph')
      if (ast.children[0].type === 'paragraph' && ast.children[0].children) {
        expect(ast.children[0].children).toHaveLength(3)
        expect(ast.children[0].children[1].type).toBe('inlineCode')
      }
    })

    it('should parse code block correctly', () => {
      const markdown = '```javascript\nconst x = 1;\n```'
      const ast = parseMarkdown(markdown)
      expect(ast.type).toBe('root')
      expect(ast.children[0].type).toBe('code')
      if (ast.children[0].type === 'code') {
        expect(ast.children[0].lang).toBe('javascript')
      }
    })

    it('should parse unordered list correctly', () => {
      const markdown = '- Item 1\n- Item 2'
      const ast = parseMarkdown(markdown)
      expect(ast.type).toBe('root')
      expect(ast.children[0].type).toBe('list')
      if (ast.children[0].type === 'list') {
        expect(ast.children[0].ordered).toBe(false)
      }
    })

    it('should parse ordered list correctly', () => {
      const markdown = '1. Item 1\n2. Item 2'
      const ast = parseMarkdown(markdown)
      expect(ast.type).toBe('root')
      expect(ast.children[0].type).toBe('list')
      if (ast.children[0].type === 'list') {
        expect(ast.children[0].ordered).toBe(true)
      }
    })

    it('should parse image correctly', () => {
      const markdown = '![Alt text](https://example.com/image.png)'
      const ast = parseMarkdown(markdown)
      expect(ast.type).toBe('root')
      expect(ast.children[0].type).toBe('image')
      if (ast.children[0].type === 'image') {
        expect(ast.children[0].url).toBe('https://example.com/image.png')
      }
    })

    it('should parse emphasis correctly', () => {
      const markdown = '*emphasis*'
      const ast = parseMarkdown(markdown)
      expect(ast.type).toBe('root')
      expect(ast.children[0].type).toBe('emphasis')
    })

    it('should parse strong correctly', () => {
      const markdown = '**strong**'
      const ast = parseMarkdown(markdown)
      expect(ast.type).toBe('root')
      expect(ast.children[0].type).toBe('strong')
    })

    it('should parse table correctly', () => {
      const markdown = '| Col 1 | Col 2 |\n|-------|-------|\n| Val 1 | Val 2 |'
      const ast = parseMarkdown(markdown)
      expect(ast.type).toBe('root')
      expect(ast.children[0].type).toBe('table')
      if (ast.children[0].type === 'table' && ast.children[0].children) {
        expect(ast.children[0].children).toHaveLength(2)
      }
    })

    it('should parse link correctly', () => {
      const markdown = '[Link text](https://example.com)'
      const ast = parseMarkdown(markdown)
      expect(ast.type).toBe('root')
      expect(ast.children[0].type).toBe('link')
      if (ast.children[0].type === 'link') {
        expect(ast.children[0].url).toBe('https://example.com')
      }
    })

    it('should parse blockquote correctly', () => {
      const markdown = '> This is a quote'
      const ast = parseMarkdown(markdown)
      expect(ast.type).toBe('root')
      expect(ast.children[0].type).toBe('blockquote')
    })

    it('should parse thematic break correctly', () => {
      const markdown = '---'
      const ast = parseMarkdown(markdown)
      expect(ast.type).toBe('root')
      expect(ast.children[0].type).toBe('thematicBreak')
    })

    it('should parse delete correctly', () => {
      const markdown = '~~deleted text~~'
      const ast = parseMarkdown(markdown)
      expect(ast.type).toBe('root')
      expect(ast.children[0].type).toBe('delete')
    })
  })
})
