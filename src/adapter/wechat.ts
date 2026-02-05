import type { MdNode, MdRootNode, PlatformNode, PlatformRootNode } from '../types'

export function wechatAdapter(mdast: any): PlatformRootNode {
  function transform(node: any): PlatformNode | null {
    switch (node.type) {
      case 'heading':
        return {
          type: 'div',
          tag: 'div',
          level: node.depth,
          children: node.children ? node.children.map(transform).filter((n: any): n is PlatformNode => n !== null) : []
        }

      case 'paragraph':
        // 检查是否为包含多个 emoji 行的段落，需要转换为列表
        const textValue = node.children
          ?.filter((c: any) => c.type === 'text')
          .map((c: any) => c.value)
          .join('') || ''

        const textLines = textValue.split('\n').filter((l: string) => l.trim())
        const emojiLines = textLines.filter((line: string) => {
          const trimmed = line.trim()
          return trimmed && /^[\u{1F300}-\u{1F9FF}]/u.test(trimmed)
        })

        if (emojiLines.length >= 2) {
          // 转换为列表
          return {
            type: 'ul',
            children: textLines.map((line: string) => ({
              type: 'li',
              children: [{
                type: 'p',
                children: [{
                  type: 'text',
                  value: line.trim()
                }]
              }]
            }))
          }
        }

        return {
          type: 'p',
          children: node.children ? node.children.map(transform).filter((n: any): n is PlatformNode => n !== null) : []
        }

      case 'text':
        return {
          type: 'text',
          value: node.value
        }

      case 'inlineCode':
        return {
          type: 'inlineCode',
          value: node.value
        }

      case 'code':
        if (node.lang === 'mermaid') {
          return {
            type: 'mermaid',
            value: node.value
          }
        }
        return {
          type: 'codeblock',
          value: node.value,
          lang: node.lang || ''
        }

      case 'list':
        return {
          type: node.ordered ? 'ol' : 'ul',
          children: node.children ? node.children.map(transform).filter((n: any): n is PlatformNode => n !== null) : []
        }

      case 'listItem':
        return {
          type: 'li',
          children: node.children ? node.children.map(transform).filter((n: any): n is PlatformNode => n !== null) : []
        }

      case 'image':
        return {
          type: 'image',
          url: node.url,
          alt: node.alt || ''
        }

      case 'emphasis':
      case 'strong':
        return {
          type: node.type,
          children: node.children ? node.children.map(transform).filter((n: any): n is PlatformNode => n !== null) : []
        }

      case 'table':
        return {
          type: 'table',
          children: node.children ? node.children.map(transform).filter((n: any): n is PlatformNode => n !== null) as any : []
        }

      case 'tableRow':
        const isHeader = mdast.type === 'table' && mdast.children.length > 0 && mdast.children[0] === node
        return {
          type: 'tableRow',
          isHeader,
          children: node.children ? node.children.map(transform).filter((n: any): n is PlatformNode => n !== null) as any : []
        }

      case 'tableCell':
        return {
          type: 'tableCell',
          children: node.children ? node.children.map(transform).filter((n: any): n is PlatformNode => n !== null) : []
        }

      case 'link':
        return {
          type: 'link',
          url: node.url,
          title: node.title,
          children: node.children ? node.children.map(transform).filter((n: any): n is PlatformNode => n !== null) : []
        }

      case 'blockquote':
        return {
          type: 'blockquote',
          children: node.children ? node.children.map(transform).filter((n: any): n is PlatformNode => n !== null) : []
        }

      case 'thematicBreak':
        return {
          type: 'thematicBreak'
        }

      case 'delete':
        return {
          type: 'delete',
          children: node.children ? node.children.map(transform).filter((n: any): n is PlatformNode => n !== null) : []
        }

      default:
        return null
    }
  }

  return {
    type: 'root',
    children: (mdast as MdRootNode).children
      ? (mdast as MdRootNode).children.map(transform).filter((node): node is PlatformNode => node !== null)
      : []
  }
}
