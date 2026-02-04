// Mock for parser module
export function parseMarkdown(markdown: string): any {
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

  // Check for code block
  if (markdown.includes('```')) {
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
    return {
      type: 'root',
      children: [
        {
          type: 'list',
          ordered: false,
          children: markdown.split('\n').filter(line => line.trim()).map(line => ({
            type: 'listItem',
            children: [{ type: 'text', value: line.replace(/^[-*]\s+/, '') }]
          }))
        }
      ]
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
