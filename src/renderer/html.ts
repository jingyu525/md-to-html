import { theme } from '../theme/wechat-default'

export function renderHTML(ast: any): string {
  function render(node: any): string {
    switch (node.type) {
      case 'root':
        return node.children.map(render).join('')

      case 'div':
        const headingStyle = theme.heading[node.level as keyof typeof theme.heading] || theme.heading[1]
        return `<div style="${headingStyle}">
          ${node.children.map(render).join('')}
        </div>`

      case 'p':
        return `<p style="${theme.p}">
          ${node.children.map(render).join('')}
        </p>`

      case 'text':
        return node.value

      case 'inlineCode':
        return `<span style="${theme.inlineCode}">${escapeHtml(node.value)}</span>`

      case 'emphasis':
        return `<em>${node.children.map(render).join('')}</em>`

      case 'strong':
        return `<strong>${node.children.map(render).join('')}</strong>`

      case 'codeblock':
        return `
<table style="${theme.codeTable}">
<tr><td>
<pre style="${theme.codePre}">${escapeHtml(node.value)}</pre>
</td></tr>
</table>
        `

      case 'ul':
        return `<ul style="${theme.ul}">
          ${node.children.map(render).join('')}
        </ul>`

      case 'ol':
        return `<ol style="${theme.ol}">
          ${node.children.map(render).join('')}
        </ol>`

      case 'li':
        return `<li style="${theme.li}">
          ${node.children.map(render).join('')}
        </li>`

      case 'image':
        return `<img src="${escapeHtml(node.url)}" alt="${escapeHtml(node.alt)}" style="${theme.img}" />`

      default:
        return ''
    }
  }

  return render(ast)
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (s) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[s]!))
}
