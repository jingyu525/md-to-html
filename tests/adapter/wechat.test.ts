import { wechatAdapter } from '../../src/adapter/wechat'
import type { MdRootNode } from '../../src/types'

describe('Adapter', () => {
  const createMdast = (type: string, props: any = {}): MdRootNode => ({
    type: 'root',
    children: [
      {
        type,
        ...props
      }
    ]
  })

  describe('wechatAdapter', () => {
    it('should transform heading to div', () => {
      const mdast = createMdast('heading', { depth: 2 })
      const result = wechatAdapter(mdast)
      expect(result.type).toBe('root')
      expect(result.children[0].type).toBe('div')
      if (result.children[0].type === 'div') {
        expect(result.children[0].level).toBe(2)
      }
    })

    it('should transform paragraph to p', () => {
      const mdast = createMdast('paragraph', { children: [{ type: 'text', value: 'Test' }] })
      const result = wechatAdapter(mdast)
      expect(result.type).toBe('root')
      expect(result.children[0].type).toBe('p')
    })

    it('should transform inline code', () => {
      const mdast = createMdast('paragraph', {
        children: [
          { type: 'text', value: 'Test ' },
          { type: 'inlineCode', value: 'code' }
        ]
      })
      const result = wechatAdapter(mdast)
      expect(result.children[0].type).toBe('p')
      if (result.children[0].type === 'p' && result.children[0].children) {
        expect(result.children[0].children[1].type).toBe('inlineCode')
      }
    })

    it('should transform code block to codeblock', () => {
      const mdast = createMdast('code', {
        value: 'const x = 1;',
        lang: 'javascript'
      })
      const result = wechatAdapter(mdast)
      expect(result.children[0].type).toBe('codeblock')
      if (result.children[0].type === 'codeblock') {
        expect(result.children[0].lang).toBe('javascript')
      }
    })

    it('should transform unordered list to ul', () => {
      const mdast = createMdast('list', {
        ordered: false,
        children: [
          {
            type: 'listItem',
            children: [{ type: 'text', value: 'Item 1' }]
          }
        ]
      })
      const result = wechatAdapter(mdast)
      expect(result.children[0].type).toBe('ul')
    })

    it('should transform ordered list to ol', () => {
      const mdast = createMdast('list', {
        ordered: true,
        children: [
          {
            type: 'listItem',
            children: [{ type: 'text', value: 'Item 1' }]
          }
        ]
      })
      const result = wechatAdapter(mdast)
      expect(result.children[0].type).toBe('ol')
    })

    it('should transform image', () => {
      const mdast = createMdast('image', {
        url: 'https://example.com/image.png',
        alt: 'Alt text'
      })
      const result = wechatAdapter(mdast)
      expect(result.children[0].type).toBe('image')
      if (result.children[0].type === 'image') {
        expect(result.children[0].url).toBe('https://example.com/image.png')
        expect(result.children[0].alt).toBe('Alt text')
      }
    })

    it('should transform emphasis', () => {
      const mdast = createMdast('emphasis', {
        children: [{ type: 'text', value: 'text' }]
      })
      const result = wechatAdapter(mdast)
      expect(result.children[0].type).toBe('emphasis')
    })

    it('should transform strong', () => {
      const mdast = createMdast('strong', {
        children: [{ type: 'text', value: 'text' }]
      })
      const result = wechatAdapter(mdast)
      expect(result.children[0].type).toBe('strong')
    })

    it('should transform table', () => {
      const mdast: MdRootNode = {
        type: 'root',
        children: [
          {
            type: 'table',
            children: [
              {
                type: 'tableRow',
                children: [
                  {
                    type: 'tableCell',
                    children: [{ type: 'text', value: 'Col 1' }]
                  }
                ]
              }
            ]
          }
        ]
      }
      const result = wechatAdapter(mdast)
      expect(result.children[0].type).toBe('table')
      if (result.children[0].type === 'table' && result.children[0].children) {
        expect(result.children[0].children[0].type).toBe('tableRow')
      }
    })

    it('should transform link', () => {
      const mdast = createMdast('link', {
        url: 'https://example.com',
        children: [{ type: 'text', value: 'Link text' }]
      })
      const result = wechatAdapter(mdast)
      expect(result.children[0].type).toBe('link')
      if (result.children[0].type === 'link') {
        expect(result.children[0].url).toBe('https://example.com')
      }
    })

    it('should transform blockquote', () => {
      const mdast = createMdast('blockquote', {
        children: [{ type: 'text', value: 'Quote' }]
      })
      const result = wechatAdapter(mdast)
      expect(result.children[0].type).toBe('blockquote')
    })

    it('should transform thematic break', () => {
      const mdast = createMdast('thematicBreak')
      const result = wechatAdapter(mdast)
      expect(result.children[0].type).toBe('thematicBreak')
    })

    it('should transform delete', () => {
      const mdast = createMdast('delete', {
        children: [{ type: 'text', value: 'deleted' }]
      })
      const result = wechatAdapter(mdast)
      expect(result.children[0].type).toBe('delete')
    })
  })
})
