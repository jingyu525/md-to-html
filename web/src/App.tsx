import React from 'react'
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
    handleExportHTML
  } = useMarkdownConverter()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Toolbar
        themes={themes}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
        onLoadExample={handleLoadExample}
        onCopyHTML={handleCopyHTML}
        onExportHTML={handleExportHTML}
        markdownLength={markdown.length}
        conversionTime={conversionTime}
      />

      <div className="flex-1 flex gap-4 p-4 overflow-hidden" style={{ paddingTop: '120px' }}>
        <div className="flex-1 flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
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

        <div className="flex-1">
          <Preview html={html} />
        </div>
      </div>

      <div className="bg-gray-800 text-gray-400 px-4 py-2 text-xs text-center">
        快捷键提示: Ctrl/Cmd + Enter 复制 HTML
      </div>
    </div>
  )
}

export default App
