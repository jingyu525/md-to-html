export function wechatAdapter(mdast: any) {
  function transform(node: any): any {
    switch (node.type) {
      case 'heading':
        return {
          type: 'div',
          tag: 'div',
          level: node.depth,
          children: node.children ? node.children.map(transform) : []
        }

      case 'paragraph':
        return {
          type: 'p',
          children: node.children ? node.children.map(transform) : []
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
        return {
          type: 'codeblock',
          value: node.value,
          lang: node.lang || ''
        }

      case 'list':
        return {
          type: node.ordered ? 'ol' : 'ul',
          children: node.children ? node.children.map(transform) : []
        }

      case 'listItem':
        return {
          type: 'li',
          children: node.children ? node.children.map(transform) : []
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
          children: node.children ? node.children.map(transform) : []
        }

      default:
        return null
    }
  }

  return {
    type: 'root',
    children: mdast.children
      .map(transform)
      .filter((node: any) => node !== null)
  }
}
