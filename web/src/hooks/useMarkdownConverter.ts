import { useState, useEffect, useCallback } from 'react'
import { convertMarkdownToHTML, getAvailableThemes } from '../lib/converter'

const EXAMPLE_MARKDOWN = `# Markdown 转 WeChat HTML 示例

这是一个测试文档，用于演示 Markdown 转换为微信公众号 HTML 的效果。

## 基础文本格式

这是一段普通文本。支持 **粗体** 和 *斜体* 格式。

代码示例：\`const name = 'md2wechat'\`

### 代码块

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`
}

console.log(greet('WeChat'))
\`\`\`

## Mermaid 图表

现在支持 Mermaid 图表渲染！以下是一些示例：

### 流程图

\`\`\`mermaid
graph TD
  A[开始] --> B{判断条件}
  B -->|是| C[执行操作]
  B -->|否| D[跳过]
  C --> E[结束]
  D --> E
\`\`\`

### 序列图

\`\`\`mermaid
sequenceDiagram
  Alice->>Bob: Hello Bob, how are you?
  Bob-->>Alice: I am good thanks!
\`\`\`

## 列表

### 无序列表

- 第一项
- 第二项
- 第三项

### 有序列表

1. 第一步
2. 第二步
3. 第三步

## 图片

![示例图片](https://via.placeholder.com/600x300)

## 更多内容

这是另一段文本，用于测试段落的样式。微信公众号对样式的支持比较有限，我们使用 inline style 来保证样式的稳定性。

### 三级标题

这是三级标题下的内容。
`

export function useMarkdownConverter() {
  const [markdown, setMarkdown] = useState(EXAMPLE_MARKDOWN)
  const [html, setHtml] = useState('')
  const [currentTheme, setCurrentTheme] = useState<'wechat-default' | 'wechat-clean'>('wechat-default')
  const [conversionTime, setConversionTime] = useState<number>()
  const [isConverting, setIsConverting] = useState(false)

  const themes = getAvailableThemes()

  // 防抖转换函数
  const convert = useCallback(async (md: string, theme: 'wechat-default' | 'wechat-clean') => {
    if (!md.trim()) {
      setHtml('')
      setConversionTime(undefined)
      return
    }

    setIsConverting(true)
    const startTime = performance.now()

    const result = await convertMarkdownToHTML(md, { theme })

    const endTime = performance.now()
    setConversionTime(Math.round(endTime - startTime))
    setHtml(result.html)

    if (result.error) {
      console.error('转换错误:', result.error)
    }

    setIsConverting(false)
  }, [])

  // 防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      convert(markdown, currentTheme)
    }, 300)

    return () => clearTimeout(timer)
  }, [markdown, currentTheme, convert])

  const handleMarkdownChange = useCallback((value: string | undefined) => {
    setMarkdown(value || '')
  }, [])

  const handleThemeChange = useCallback((themeId: string) => {
    setCurrentTheme(themeId as 'wechat-default' | 'wechat-clean')
  }, [])

  const handleLoadExample = useCallback(() => {
    setMarkdown(EXAMPLE_MARKDOWN)
  }, [])

  const handleCopyHTML = useCallback(() => {
    if (!html) return

    navigator.clipboard.writeText(html).then(() => {
      console.log('HTML 已复制到剪贴板')
    }).catch((error) => {
      console.error('复制失败:', error)
    })
  }, [html])

  const handleExportHTML = useCallback(() => {
    if (!html) return

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'wechat.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [html])

  const handleCopyRichHTML = useCallback(async () => {
    if (!html) return

    // 方法 1: 尝试使用 ClipboardItem API (最可靠的方法)
    try {
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
        // 同时提供 text/html 和 text/plain 以提高兼容性
        const htmlBlob = new Blob([html], { type: 'text/html' })
        const textBlob = new Blob([html.replace(/<[^>]*>/g, '')], { type: 'text/plain' })

        const item = new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob
        })

        await navigator.clipboard.write([item])
        console.log('HTML (富文本) 已复制到剪贴板 (使用 Clipboard API)')
        return
      }
    } catch (error) {
      console.error('Clipboard API 失败:', error)
    }

    // 方法 2: 使用 document.execCommand 作为 fallback
    try {
      // 创建一个临时的 div 元素来容纳 HTML
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.whiteSpace = 'pre-wrap'
      document.body.appendChild(tempDiv)

      // 创建选区
      const range = document.createRange()
      range.selectNodeContents(tempDiv)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)

      // 执行复制
      const success = document.execCommand('copy')

      // 清理
      selection?.removeAllRanges()
      document.body.removeChild(tempDiv)

      if (success) {
        console.log('HTML (富文本) 已复制到剪贴板 (使用 execCommand)')
        return
      } else {
        throw new Error('复制命令执行失败')
      }
    } catch (error) {
      console.error('execCommand 失败:', error)
    }

    // 方法 3: 最后的降级方案：复制纯文本
    try {
      await navigator.clipboard.writeText(html)
      console.log('已降级为纯文本复制')
    } catch (finalError) {
      console.error('所有复制方法都失败:', finalError)
      throw new Error('复制失败，请手动复制')
    }
  }, [html])

  const handleOpenInNewWindow = useCallback(() => {
    if (!html) return

    const newWindow = window.open('', '_blank')
    if (!newWindow) {
      console.error('无法打开新窗口')
      return
    }

    newWindow.document.write(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>预览</title>
      </head>
      <body style="padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        ${html}
      </body>
      </html>
    `)
    newWindow.document.close()
  }, [html])

  return {
    markdown,
    html,
    currentTheme,
    themes,
    conversionTime,
    isConverting,
    handleMarkdownChange,
    handleThemeChange,
    handleLoadExample,
    handleCopyHTML,
    handleExportHTML,
    handleCopyRichHTML,
    handleOpenInNewWindow
  }
}
