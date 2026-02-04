import type { Theme } from '../types'

// 简洁风格主题 - wechat-clean
export const theme: Theme = {
  // 基础元素样式
  p: 'font-size:15px;line-height:1.75;color:#222;margin:10px 0;',
  heading: {
    1: 'font-size:20px;font-weight:500;margin:18px 0;color:#000;',
    2: 'font-size:17px;font-weight:500;margin:16px 0;color:#000;',
    3: 'font-size:15px;font-weight:500;margin:14px 0;color:#000;'
  },
  codeTable: 'width:100%;background:#fafafa;border:1px solid #eaeaea;',
  codePre: 'font-size:14px;line-height:1.5;padding:16px;color:#333;',
  inlineCode: 'background:#f0f0f0;padding:2px 5px;border-radius:2px;font-size:13px;color:#d63384;',
  ul: 'margin:10px 0;padding-left:22px;',
  ol: 'margin:10px 0;padding-left:22px;',
  li: 'margin:5px 0;',
  img: 'max-width:100%;height:auto;margin:15px 0;',
  // 新增元素样式
  table: 'margin:10px 0;border:1px solid #d0d0d0;border-radius:4px;',
  tableRow: 'display:flex;',
  tableHeaderCell: 'flex:1;background:#f5f5f5;padding:8px 12px;font-weight:500;border-bottom:1px solid #d0d0d0;',
  tableCell: 'flex:1;padding:8px 12px;border-bottom:1px solid #e5e5e5;',
  link: 'color:#0066cc;text-decoration:none;border-bottom:1px solid transparent;',
  blockquote: 'margin:10px 0;padding:10px 14px;background:#fafafa;border-left:3px solid #999;color:#666;',
  thematicBreak: 'height:1px;background:#e0e0e0;margin:24px 0;',
  delete: 'text-decoration:line-through;color:#888;'
}
