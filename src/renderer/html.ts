import type { PlatformNode, Theme } from '../types'
import { theme as defaultTheme } from '../theme/wechat-default'
import { renderMermaid } from './mermaid'

export async function renderHTML(ast: PlatformNode, customTheme?: Theme): Promise<string> {
  const theme = customTheme || defaultTheme

  async function render(node: PlatformNode): Promise<string> {
    switch (node.type) {
      case 'root':
        return node.children ? await Promise.all(node.children.map(render)).then(results => results.join('')) : ''

      case 'div':
        const headingStyle = theme.heading[(node as any).level] || theme.heading[1]
        return `<div style="${headingStyle}">
          ${node.children ? await Promise.all(node.children.map(render)).then(results => results.join('')) : ''}
        </div>`

      case 'p':
        return `<p style="${theme.p}">
          ${node.children ? await Promise.all(node.children.map(render)).then(results => results.join('')) : ''}
        </p>`

      case 'text':
        return escapeHtml(node.value)

      case 'inlineCode':
        return `<span style="${theme.inlineCode}">${escapeHtml(node.value)}</span>`

      case 'emphasis':
        return `<em>${node.children ? await Promise.all(node.children.map(render)).then(results => results.join('')) : ''}</em>`

      case 'strong':
        return `<strong>${node.children ? await Promise.all(node.children.map(render)).then(results => results.join('')) : ''}</strong>`

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
          ${node.children ? await Promise.all(node.children.map(render)).then(results => results.join('')) : ''}
        </ul>`

      case 'ol':
        return `<ol style="${theme.ol}">
          ${node.children ? await Promise.all(node.children.map(render)).then(results => results.join('')) : ''}
        </ol>`

      case 'li':
        return `<li style="${theme.li}">
          ${node.children ? await Promise.all(node.children.map(render)).then(results => results.join('')) : ''}
        </li>`

      case 'image':
        return `<img src="${escapeHtml(node.url)}" alt="${escapeHtml(node.alt)}" style="${theme.img}" />`

      case 'table':
        return `<div style="${theme.table}">
          ${node.children ? await Promise.all(node.children.map(render)).then(results => results.join('')) : ''}
        </div>`

      case 'tableRow': {
        const cellStyle = (node as any).isHeader ? theme.tableHeaderCell : theme.tableCell
        const childrenHtml = node.children ? await Promise.all(node.children.map(child => {
          const childNode = child as PlatformNode
          return render(childNode).then(html => `<div style="${cellStyle}">${html}</div>`)
        })).then(results => results.join('')) : ''
        return `<div style="${theme.tableRow}">
          ${childrenHtml}
        </div>`
      }

      case 'tableCell':
        return node.children ? await Promise.all(node.children.map(render)).then(results => results.join('')) : ''

      case 'link':
        return `<a href="${escapeHtml(node.url)}" style="${theme.link}"${node.title ? ` title="${escapeHtml(node.title)}"` : ''}>${node.children ? await Promise.all(node.children.map(render)).then(results => results.join('')) : ''}</a>`

      case 'blockquote':
        return `<div style="${theme.blockquote}">
          ${node.children ? await Promise.all(node.children.map(render)).then(results => results.join('')) : ''}
        </div>`

      case 'thematicBreak':
        return `<div style="${theme.thematicBreak}"></div>`

      case 'delete':
        return `<s>${node.children ? await Promise.all(node.children.map(render)).then(results => results.join('')) : ''}</s>`

      case 'mermaid': {
        const result = await renderMermaid(node.value)
        if (result.error) {
          return `<div style="${theme.mermaid}">Mermaid 图表渲染失败: ${escapeHtml(result.error)}</div>`
        }
        // 使用浏览器兼容的方式转换为 Base64
        const svgBase64 = btoa(unescape(encodeURIComponent(result.svg)))
        return `<img src="data:image/svg+xml;base64,${svgBase64}" alt="Mermaid Diagram" style="${theme.mermaid}" />`
      }

      default:
        return ''
    }
  }

  return await render(ast)
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


