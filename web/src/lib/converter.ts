import { parseMarkdown } from '../../../src/parser/markdown'
import { wechatAdapter } from '../../../src/adapter/wechat'
import { renderHTML } from '../../../src/renderer/html'

// 导入主题
import { theme as wechatDefaultTheme } from '../../../src/theme/wechat-default'
import { theme as wechatCleanTheme } from '../../../src/theme/wechat-clean'

export interface ConverterOptions {
  theme?: 'wechat-default' | 'wechat-clean'
}

export interface ConverterResult {
  html: string
  error?: string
}

export async function convertMarkdownToHTML(markdown: string, options: ConverterOptions = {}): Promise<ConverterResult> {
  try {
    const themeName = options.theme || 'wechat-default'
    const theme = themeName === 'wechat-clean' ? wechatCleanTheme : wechatDefaultTheme

    const mdast = parseMarkdown(markdown)
    const wechatAst = wechatAdapter(mdast)
    const html = await renderHTML(wechatAst, theme)

    return { html }
  } catch (error) {
    console.error('转换失败:', error)
    return {
      html: '',
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

export function getAvailableThemes() {
  return [
    { id: 'wechat-default', name: '默认风格' },
    { id: 'wechat-clean', name: '简约风格' }
  ]
}
