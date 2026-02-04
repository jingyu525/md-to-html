import type { Theme } from '../types'

export const theme: Theme = {
  // 基础元素样式
  p: 'font-size:15px;line-height:1.8;color:#333;margin:12px 0;',
  heading: {
    1: 'font-size:22px;font-weight:600;margin:20px 0;',
    2: 'font-size:18px;font-weight:600;margin:18px 0;',
    3: 'font-size:16px;font-weight:600;margin:16px 0;'
  },
  codeTable: 'width:100%;background:#f6f8fa;border-radius:6px;',
  codePre: 'font-size:13px;line-height:1.6;padding:12px;',
  inlineCode: 'background:#f6f8fa;padding:2px 4px;border-radius:3px;font-size:13px;',
  ul: 'margin:12px 0;padding-left:20px;',
  ol: 'margin:12px 0;padding-left:20px;',
  li: 'margin:6px 0;',
  img: 'max-width:100%;height:auto;margin:12px 0;',
  // 新增元素样式
  table: 'margin:12px 0;border:1px solid #e1e4e8;border-radius:6px;overflow:hidden;',
  tableRow: 'display:flex;',
  tableHeaderCell: 'flex:1;background:#f6f8fa;padding:8px 12px;font-weight:600;border-bottom:1px solid #e1e4e8;',
  tableCell: 'flex:1;padding:8px 12px;border-bottom:1px solid #e1e4e8;',
  link: 'color:#007bff;text-decoration:none;',
  blockquote: 'margin:12px 0;padding:8px 12px;background:#f6f8fa;border-left:4px solid #007bff;color:#555;',
  thematicBreak: 'height:1px;background:#e1e4e8;margin:20px 0;',
  delete: 'text-decoration:line-through;color:#999;'
}

