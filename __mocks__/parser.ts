// Mock for parser module
export function parseMarkdown(markdown: string): any {
  // Check for mermaid code blocks (support multiple)
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/g
  const matches = [...markdown.matchAll(mermaidRegex)]

  if (matches.length > 0) {
    const children = []
    let lastIndex = 0

    matches.forEach((match) => {
      const beforeContent = markdown.slice(lastIndex, match.index).trim()
      const mermaidCode = match[1].trim()

      // Parse content before mermaid using the original logic
      if (beforeContent) {
        const parsed = parseContentWithoutMermaid(beforeContent)
        if (parsed.children) {
          children.push(...parsed.children)
        }
      }

      // Add mermaid code
      children.push({
        type: 'code',
        value: mermaidCode,
        lang: 'mermaid'
      })

      lastIndex = match.index! + match[0].length
    })

    // Parse content after last mermaid
    const afterContent = markdown.slice(lastIndex).trim()
    if (afterContent) {
      const parsed = parseContentWithoutMermaid(afterContent)
      if (parsed.children) {
        children.push(...parsed.children)
      }
    }

    return {
      type: 'root',
      children
    }
  }

  // If no mermaid, parse normally
  return parseContentWithoutMermaid(markdown)
}

function parseContentWithoutMermaid(markdown: string): any {
  // Check for inline code in paragraph
  const inlineCodeMatch = markdown.match(/`([^`]+)`/)
  if (inlineCodeMatch && !markdown.includes('```')) {
    const parts = markdown.split(/`[^`]+`/)
    return {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            { type: 'text', value: parts[0] || '' },
            { type: 'inlineCode', value: inlineCodeMatch[1] },
            { type: 'text', value: parts[1] || '' }
          ]
        }
      ]
    }
  }

  // Check for emphasis
  if (markdown.match(/^\*[^*]+\*$/)) {
    return {
      type: 'root',
      children: [
        {
          type: 'emphasis',
          children: [{ type: 'text', value: markdown.replace(/^\*|\*$/g, '') }]
        }
      ]
    }
  }

  // Check for strong
  if (markdown.match(/^\*\*[^*]+\*\*$/)) {
    return {
      type: 'root',
      children: [
        {
          type: 'strong',
          children: [{ type: 'text', value: markdown.replace(/^\*\*|\*\*$/g, '') }]
        }
      ]
    }
  }

  // Check for heading
  if (markdown.startsWith('#')) {
    const match = markdown.match(/^(#{1,6})\s+(.+)/)
    const depth = match ? match[1].length : 1
    return {
      type: 'root',
      children: [
        {
          type: 'heading',
          depth,
          children: [{ type: 'text', value: match ? match[2] : 'Heading' }]
        }
      ]
    }
  }

  // Check for code block (non-mermaid)
  if (markdown.includes('```') && !markdown.includes('```mermaid')) {
    const langMatch = markdown.match(/```(\w+)/)
    return {
      type: 'root',
      children: [
        {
          type: 'code',
          value: markdown.replace(/```\w*\n?|```/g, ''),
          lang: langMatch ? langMatch[1] : ''
        }
      ]
    }
  }

  // Check for unordered list
  if (markdown.startsWith('- ') || markdown.startsWith('* ')) {
    // Check if the last item contains inline formatting like **text**
    const lines = markdown.split('\n').filter(line => line.trim())
    const listItems = []
    const extraContent = []

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        listItems.push({
          type: 'listItem',
          children: [{ type: 'text', value: trimmed.replace(/^[-*]\s+/, '') }]
        })
      } else {
        extraContent.push(trimmed)
      }
    }

    const children = []
    if (listItems.length > 0) {
      children.push({
        type: 'list',
        ordered: false,
        children: listItems
      })
    }

    // Parse extra content separately
    if (extraContent.length > 0) {
      const extraParsed = parseContentWithoutMermaid(extraContent.join('\n'))
      if (extraParsed.children) {
        children.push(...extraParsed.children)
      }
    }

    return {
      type: 'root',
      children
    }
  }

  // Check for ordered list
  if (/^\d+\./.test(markdown)) {
    return {
      type: 'root',
      children: [
        {
          type: 'list',
          ordered: true,
          children: markdown.split('\n').filter(line => line.trim()).map(line => ({
            type: 'listItem',
            children: [{ type: 'text', value: line.replace(/^\d+\.\s+/, '') }]
          }))
        }
      ]
    }
  }

  // Check for image
  if (markdown.startsWith('![')) {
    const urlMatch = markdown.match(/!\[.*?\]\((.*?)\)/)
    return {
      type: 'root',
      children: [
        {
          type: 'image',
          url: urlMatch ? urlMatch[1] : '',
          alt: ''
        }
      ]
    }
  }

  // Check for blockquote
  if (markdown.startsWith('>')) {
    return {
      type: 'root',
      children: [
        {
          type: 'blockquote',
          children: [{ type: 'text', value: markdown.replace(/^>\s*/, '') }]
        }
      ]
    }
  }

  // Check for thematic break
  if (markdown === '---' || markdown === '***') {
    return {
      type: 'root',
      children: [{ type: 'thematicBreak' }]
    }
  }

  // Check for delete
  if (markdown.startsWith('~~')) {
    return {
      type: 'root',
      children: [
        {
          type: 'delete',
          children: [{ type: 'text', value: markdown.replace(/^~~|~~$/g, '') }]
        }
      ]
    }
  }

  // Check for link
  if (markdown.startsWith('[') && !markdown.startsWith('![')) {
    const linkMatch = markdown.match(/\[(.*?)\]\((.*?)\)/)
    return {
      type: 'root',
      children: [
        {
          type: 'link',
          url: linkMatch ? linkMatch[2] : '',
          children: [{ type: 'text', value: linkMatch ? linkMatch[1] : 'Link' }]
        }
      ]
    }
  }

  // Check for table
  if (markdown.startsWith('|')) {
    return {
      type: 'root',
      children: [
        {
          type: 'table',
          children: markdown.split('\n')
            .filter(line => line.trim())
            .slice(0, 2)  // Skip separator row
            .map((line, idx) => ({
              type: 'tableRow',
              children: line.split('|')
                .filter(cell => cell.trim())
                .map(cell => ({
                  type: 'tableCell',
                  children: [{ type: 'text', value: cell.trim() }]
                }))
            }))
        }
      ]
    }
  }

  // Default: paragraph
  return {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          { type: 'text', value: markdown }
        ]
      }
    ]
  }
}
