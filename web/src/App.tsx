import React, { useEffect } from 'react'
import { useMarkdownConverter } from './hooks/useMarkdownConverter'
import Editor from './components/Editor'
import Preview from './components/Preview'
import Toolbar from './components/Toolbar'

function App() {
  const {
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
    handleCopyRichHTML,
    handleOpenInNewWindow,
    handleExportHTML
  } = useMarkdownConverter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        handleCopyRichHTML()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleCopyRichHTML])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Toolbar
        themes={themes}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
        onLoadExample={handleLoadExample}
        onCopyHTML={handleCopyHTML}
        onCopyRichHTML={handleCopyRichHTML}
        onOpenInNewWindow={handleOpenInNewWindow}
        markdownLength={markdown.length}
        conversionTime={conversionTime}
      />

      <div className="flex-1 gap-4 p-4 overflow-hidden flex" style={{ paddingTop: '140px' }}>
        <div className="w-1/2 flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">编辑器</span>
            {isConverting && (
              <span className="text-xs text-blue-600 flex items-center gap-1">
                <span className="animate-pulse">●</span>
                转换中...
              </span>
            )}
          </div>
          <div className="flex-1">
            <Editor
              value={markdown}
              onChange={handleMarkdownChange}
              theme="vs-dark"
            />
          </div>
        </div>

        <div className="w-1/2">
          <Preview
            html={html}
          />
        </div>
      </div>

      <div className="bg-gray-800 text-gray-400 px-4 py-2 text-xs text-center">
        快捷键提示: Ctrl/Cmd + Enter 复制 HTML (纯文本) | Ctrl/Cmd + Shift + C 复制 HTML (富文本)
      </div>
    </div>
  )
}

export default App
