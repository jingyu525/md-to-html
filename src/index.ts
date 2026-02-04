import fs from 'fs'
import path from 'path'
import { parseMarkdown } from './parser/markdown'
import { wechatAdapter } from './adapter/wechat'
import { renderHTML } from './renderer/html'

function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Usage: md2wechat <markdown-file>')
    process.exit(1)
  }

  const inputFile = args[0]

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File not found: ${inputFile}`)
    process.exit(1)
  }

  try {
    const markdown = fs.readFileSync(inputFile, 'utf-8')

    const mdast = parseMarkdown(markdown)
    const wechatAst = wechatAdapter(mdast)
    const html = renderHTML(wechatAst)

    console.log(html)
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { parseMarkdown, wechatAdapter, renderHTML }
