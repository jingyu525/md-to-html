import React, { useRef } from 'react'
import Editor from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

interface EditorProps {
  value: string
  onChange: (value: string | undefined) => void
  height?: string
  theme?: 'vs-dark' | 'vs-light'
}

export default function EditorComponent(props: EditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
  }

  const handleEditorChange = (value: string | undefined) => {
    props.onChange(value)
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Editor
        height={props.height || '100%'}
        defaultLanguage="markdown"
        value={props.value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={props.theme || 'vs-dark'}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
          tabSize: 2,
          insertSpaces: true,
          renderWhitespace: 'selection',
          bracketPairColorization: { enabled: true },
          suggestOnTriggerCharacters: true
        }}
      />
    </div>
  )
}
