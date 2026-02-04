# md2wechat

一个将 Markdown 转换为微信公众号兼容的 HTML 的命令行工具。

## 特性

- ✅ 完整的 Markdown 语法支持
- ✅ 专为微信公众号优化的内联样式
- ✅ 自定义主题支持
- ✅ 输出到文件或控制台
- ✅ 完整的类型定义
- ✅ 单元测试覆盖

## 支持的 Markdown 元素

- 标题（H1-H6）
- 段落
- 粗体和斜体
- 行内代码
- 代码块（支持语法高亮）
- 有序和无序列表
- 图片
- 表格
- 链接
- 引用块
- 分隔线
- 删除线

## 安装

```bash
npm install -g md2wechat
```

或从源码安装：

```bash
git clone <repository-url>
cd md-to-html
npm install
npm run build
npm link
```

## 使用

### 基本用法

```bash
md2wechat <markdown-file>
```

### 输出到文件

```bash
md2wechat input.md --output output.html
```

或使用短选项：

```bash
md2wechat input.md -o output.html
```

### 使用自定义主题

```bash
md2wechat input.md --theme wechat-clean
```

### 组合使用

```bash
md2wechat input.md --output output.html --theme wechat-clean
```

## 可用主题

### wechat-default（默认）

微信公众号默认风格，适合大多数场景。

### wechat-clean

简约风格，使用更柔和的颜色和更紧凑的间距。

## 开发

### 安装依赖

```bash
npm install
```

### 构建

```bash
npm run build
```

### 运行测试

```bash
npm test
```

### 监听测试

```bash
npm run test:watch
```

### 代码覆盖率

```bash
npm run test:coverage
```

### 代码检查

```bash
npm run lint
```

### 自动修复

```bash
npm run lint:fix
```

## 项目结构

```
md-to-html/
├── src/
│   ├── adapter/      # 平台适配器
│   ├── parser/        # Markdown 解析器
│   ├── renderer/      # HTML 渲染器
│   ├── theme/         # 主题定义
│   └── types/         # TypeScript 类型定义
├── tests/             # 单元测试
├── bin/              # CLI 入口
└── dist/             # 编译输出
```

## 技术栈

- **解析**: unified + remark-parse
- **类型**: TypeScript
- **测试**: Jest + ts-jest
- **代码检查**: ESLint + Standard
- **构建**: TypeScript Compiler

## 示例

输入 Markdown：

```markdown
# 标题

这是一段**粗体**和*斜体*文本。

## 列表

- 项目 1
- 项目 2
```

输出 HTML：

```html
<div style="font-size:22px;font-weight:600;margin:20px 0;">
  标题
</div>
<p style="font-size:15px;line-height:1.8;color:#333;margin:12px 0;">
  这是一段<strong>粗体</strong>和<em>斜体</em>文本。
</p>
<div style="font-size:18px;font-weight:600;margin:18px 0;">
  列表
</div>
<ul style="margin:12px 0;padding-left:20px;">
  <li style="margin:6px 0;">
    <p style="font-size:15px;line-height:1.8;color:#333;margin:12px 0;">
      项目 1
    </p>
  </li>
  <li style="margin:6px 0;">
    <p style="font-size:15px;line-height:1.8;color:#333;margin:12px 0;">
      项目 2
    </p>
  </li>
</ul>
```

## 许可证

MIT

## 版本

当前版本：v0.2
