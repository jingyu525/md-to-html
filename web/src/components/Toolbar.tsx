import React, { useState } from 'react'
import { FileText, Copy, Download, RefreshCw, ExternalLink, Code2 } from 'lucide-react'
import ThemeSelector from './ThemeSelector'

interface ToolbarProps {
  themes: Array<{ id: string, name: string }>
  currentTheme: string
  onThemeChange: (themeId: string) => void
  onLoadExample: () => void
  onCopyHTML: () => void
  onCopyRichHTML: () => void
  onExportHTML: () => void
  onOpenInNewWindow: () => void
  markdownLength: number
  conversionTime?: number
}

export default function ToolbarComponent(props: ToolbarProps) {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const handleAction = (action: () => void, message: string) => {
    action()
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">md2wechat</h1>
          </div>
          <ThemeSelector
            themes={props.themes}
            currentTheme={props.currentTheme}
            onThemeChange={props.onThemeChange}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAction(props.onLoadExample, '示例已加载')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            加载示例
          </button>

          <button
            onClick={() => handleAction(props.onCopyRichHTML, 'HTML (富文本) 已复制到剪贴板')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <Copy className="w-4 h-4" />
            复制 HTML
          </button>

          <button
            onClick={() => handleAction(props.onCopyHTML, 'HTML (纯文本) 已复制到剪贴板')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Code2 className="w-4 h-4" />
            纯文本
          </button>

          <button
            onClick={() => handleAction(props.onOpenInNewWindow, '新窗口已打开')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            新窗口
          </button>

          <button
            onClick={() => handleAction(props.onExportHTML, 'HTML 文件已导出')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Download className="w-4 h-4" />
            导出 HTML
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>字数: {props.markdownLength}</span>
        {props.conversionTime && <span>转换耗时: {props.conversionTime}ms</span>}
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 px-4 py-2 bg-gray-900 text-white text-sm rounded-md shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
