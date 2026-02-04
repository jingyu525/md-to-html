// MdAST 节点类型（unified/remark 的标准 AST）
export interface MdRootNode {
  type: 'root'
  children: MdNode[]
}

export interface MdTextNode {
  type: 'text'
  value: string
}

export interface MdInlineCodeNode {
  type: 'inlineCode'
  value: string
}

export interface MdHeadingNode {
  type: 'heading'
  depth: number
  children: MdNode[]
}

export interface MdParagraphNode {
  type: 'paragraph'
  children: MdNode[]
}

export interface MdCodeNode {
  type: 'code'
  value: string
  lang?: string
}

export interface MdListNode {
  type: 'list'
  ordered: boolean
  children: MdNode[]
}

export interface MdListItemNode {
  type: 'listItem'
  children: MdNode[]
}

export interface MdImageNode {
  type: 'image'
  url: string
  alt?: string
  title?: string
}

export interface MdEmphasisNode {
  type: 'emphasis'
  children: MdNode[]
}

export interface MdStrongNode {
  type: 'strong'
  children: MdNode[]
}

export interface MdTableNode {
  type: 'table'
  align?: ('left' | 'right' | 'center' | null)[]
  children: MdNode[]
}

export interface MdTableRowNode {
  type: 'tableRow'
  children: MdNode[]
}

export interface MdTableCellNode {
  type: 'tableCell'
  children: MdNode[]
}

export interface MdLinkNode {
  type: 'link'
  url: string
  title?: string
  children: MdNode[]
}

export interface MdBlockquoteNode {
  type: 'blockquote'
  children: MdNode[]
}

export interface MdThematicBreakNode {
  type: 'thematicBreak'
}

export interface MdDeleteNode {
  type: 'delete'
  children: MdNode[]
}

export type MdNode =
  | MdRootNode
  | MdTextNode
  | MdInlineCodeNode
  | MdHeadingNode
  | MdParagraphNode
  | MdCodeNode
  | MdListNode
  | MdListItemNode
  | MdImageNode
  | MdEmphasisNode
  | MdStrongNode
  | MdTableNode
  | MdTableRowNode
  | MdTableCellNode
  | MdLinkNode
  | MdBlockquoteNode
  | MdThematicBreakNode
  | MdDeleteNode

// PlatformAST 节点类型（平台适配后的结构化表示）
export interface PlatformRootNode {
  type: 'root'
  children: PlatformNode[]
}

export interface PlatformTextNode {
  type: 'text'
  value: string
}

export interface PlatformInlineCodeNode {
  type: 'inlineCode'
  value: string
}

export interface PlatformHeadingNode {
  type: 'div'
  tag: 'div'
  level: number
  children: PlatformNode[]
}

export interface PlatformParagraphNode {
  type: 'p'
  children: PlatformNode[]
}

export interface PlatformCodeblockNode {
  type: 'codeblock'
  value: string
  lang: string
}

export interface PlatformListNode {
  type: 'ul' | 'ol'
  children: PlatformNode[]
}

export interface PlatformListItemNode {
  type: 'li'
  children: PlatformNode[]
}

export interface PlatformImageNode {
  type: 'image'
  url: string
  alt: string
}

export interface PlatformEmphasisNode {
  type: 'emphasis'
  children: PlatformNode[]
}

export interface PlatformStrongNode {
  type: 'strong'
  children: PlatformNode[]
}

export interface PlatformTableNode {
  type: 'table'
  children: PlatformTableRowNode[]
}

export interface PlatformTableRowNode {
  type: 'tableRow'
  isHeader: boolean
  children: PlatformTableCellNode[]
}

export interface PlatformTableCellNode {
  type: 'tableCell'
  children: PlatformNode[]
}

export interface PlatformLinkNode {
  type: 'link'
  url: string
  title?: string
  children: PlatformNode[]
}

export interface PlatformBlockquoteNode {
  type: 'blockquote'
  children: PlatformNode[]
}

export interface PlatformThematicBreakNode {
  type: 'thematicBreak'
}

export interface PlatformDeleteNode {
  type: 'delete'
  children: PlatformNode[]
}

export type PlatformNode =
  | PlatformRootNode
  | PlatformTextNode
  | PlatformInlineCodeNode
  | PlatformHeadingNode
  | PlatformParagraphNode
  | PlatformCodeblockNode
  | PlatformListNode
  | PlatformListItemNode
  | PlatformImageNode
  | PlatformEmphasisNode
  | PlatformStrongNode
  | PlatformTableNode
  | PlatformTableRowNode
  | PlatformTableCellNode
  | PlatformLinkNode
  | PlatformBlockquoteNode
  | PlatformThematicBreakNode
  | PlatformDeleteNode

// 主题类型定义
export interface Theme {
  // 基础元素样式
  p: string
  heading: {
    [level: number]: string
  }
  inlineCode: string
  codeTable: string
  codePre: string
  ul: string
  ol: string
  li: string
  img: string
  // 新增元素样式
  table: string
  tableRow: string
  tableHeaderCell: string
  tableCell: string
  link: string
  blockquote: string
  thematicBreak: string
  delete: string
}
