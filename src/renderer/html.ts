import type { PlatformNode, Theme } from '../types'
import { theme as defaultTheme } from '../theme/wechat-default'

export function renderHTML(ast: PlatformNode, customTheme?: Theme): string {
  const theme = customTheme || defaultTheme

  function render(node: PlatformNode): string {
    switch (node.type) {
      case 'root':
        return node.children ? node.children.map(render).join('') : ''

      case 'div':
        const headingStyle = theme.heading[(node as any).level] || theme.heading[1]
        return `<div style="${headingStyle}">
          ${node.children ? node.children.map(render).join('') : ''}
        </div>`

      case 'p':
        return `<p style="${theme.p}">
          ${node.children ? node.children.map(render).join('') : ''}
        </p>`

      case 'text':
        return escapeHtml(node.value)

      case 'inlineCode':
        return `<span style="${theme.inlineCode}">${escapeHtml(node.value)}</span>`

      case 'emphasis':
        return `<em>${node.children ? node.children.map(render).join('') : ''}</em>`

      case 'strong':
        return `<strong>${node.children ? node.children.map(render).join('') : ''}</strong>`

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
          ${node.children ? node.children.map(render).join('') : ''}
        </ul>`

      case 'ol':
        return `<ol style="${theme.ol}">
          ${node.children ? node.children.map(render).join('') : ''}
        </ol>`

      case 'li':
        return `<li style="${theme.li}">
          ${node.children ? node.children.map(render).join('') : ''}
        </li>`

      case 'image':
        return `<img src="${escapeHtml(node.url)}" alt="${escapeHtml(node.alt)}" style="${theme.img}" />`

      case 'table':
        return `<div style="${theme.table}">
          ${node.children ? node.children.map(render).join('') : ''}
        </div>`

      case 'tableRow': {
        const cellStyle = (node as any).isHeader ? theme.tableHeaderCell : theme.tableCell
        return `<div style="${theme.tableRow}">
          ${node.children ? node.children.map(child => {
            const childNode = child as PlatformNode
            return `<div style="${cellStyle}">${render(childNode)}</div>`
          }).join('') : ''}
        </div>`
      }

      case 'tableCell':
        return node.children ? node.children.map(render).join('') : ''

      case 'link':
        return `<a href="${escapeHtml(node.url)}" style="${theme.link}"${node.title ? ` title="${escapeHtml(node.title)}"` : ''}>${node.children ? node.children.map(render).join('') : ''}</a>`

      case 'blockquote':
        return `<div style="${theme.blockquote}">
          ${node.children ? node.children.map(render).join('') : ''}
        </div>`

      case 'thematicBreak':
        return `<div style="${theme.thematicBreak}"></div>`

      case 'delete':
        return `<s>${node.children ? node.children.map(render).join('') : ''}</s>`

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


