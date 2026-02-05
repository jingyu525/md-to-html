import fs from 'fs'
import path from 'path'
import minimist from 'minimist'
import { parseMarkdown } from './parser/markdown'
import { wechatAdapter } from './adapter/wechat'
import { renderHTML } from './renderer/html'

async function main() {
  const args = minimist(process.argv.slice(2), {
    alias: {
      output: 'o',
      theme: 't'
    }
  })

  const inputFile = args._[0]

  if (!inputFile) {
    console.log('Usage: md2wechat <markdown-file> [--output|-o <output-file>] [--theme|-t <theme-name>]')
    process.exit(1)
  }

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File not found: ${inputFile}`)
    process.exit(1)
  }

  const outputFile = args.output
  const themeName = args.theme || 'wechat-default'

  try {
    const markdown = fs.readFileSync(inputFile, 'utf-8')

    const mdast = parseMarkdown(markdown) as any
    const wechatAst = wechatAdapter(mdast) as any

    // 动态导入主题
    const { theme } = require(`./theme/${themeName}.js`)
    const html = await renderHTML(wechatAst, theme as any)

    if (outputFile) {
      fs.writeFileSync(outputFile, html, 'utf-8')
      console.log(`HTML has been written to: ${outputFile}`)
    } else {
      console.log(html)
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { parseMarkdown, wechatAdapter, renderHTML, main }
