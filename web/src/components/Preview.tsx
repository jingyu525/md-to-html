import React, { useEffect, useRef } from 'react'

interface PreviewProps {
  html: string
}

export default function PreviewComponent(props: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const doc = iframe.contentDocument
    if (!doc) return

    // 注入基础样式
    const baseStyle = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 15px;
        line-height: 1.8;
        color: #333;
        padding: 20px;
        max-width: 100%;
      }
      img {
        max-width: 100%;
        height: auto;
      }
      table {
        border-collapse: collapse;
        word-break: break-word;
      }
    `

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${baseStyle}</style>
        </head>
        <body>
          ${props.html || '<p style="color: #999; text-align: center;">预览内容为空</p>'}
        </body>
      </html>
    `

    doc.open()
    doc.write(content)
    doc.close()
  }, [props.html])

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg overflow-hidden border border-gray-200">
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">预览</span>
        <span className="text-xs text-gray-500">微信公众号样式</span>
      </div>
      <div className="flex-1 overflow-auto">
        <iframe
          ref={iframeRef}
          title="Preview"
          sandbox="allow-same-origin"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  )
}
