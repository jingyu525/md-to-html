import mermaid from 'mermaid'

export interface MermaidRenderOptions {
  theme?: 'default' | 'dark' | 'forest' | 'neutral'
  backgroundColor?: string
}

const mermaidCache = new Map<string, string>()
let initializedConfig: MermaidRenderOptions | null = null

async function ensureMermaidInitialized(options: MermaidRenderOptions) {
  const { theme = 'default' } = options

  // 如果已初始化且主题相同，则跳过
  if (initializedConfig && initializedConfig.theme === theme) {
    return
  }

  try {
    await mermaid.initialize({
      startOnLoad: false,
      theme,
      securityLevel: 'loose'
    })
    initializedConfig = { theme }
  } catch (error) {
    console.error('Mermaid initialization error:', error)
    throw error
  }
}

export async function renderMermaid(
  code: string,
  options: MermaidRenderOptions = {}
): Promise<{ svg: string; error?: string }> {
  const { theme = 'default', backgroundColor = 'transparent' } = options

  // 检查缓存
  const cacheKey = `${code}-${theme}-${backgroundColor}`
  if (mermaidCache.has(cacheKey)) {
    return { svg: mermaidCache.get(cacheKey)! }
  }

  try {
    // 确保 mermaid 已初始化（带正确的主题）
    await ensureMermaidInitialized({ theme })

    // 初始化 mermaid
    const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // 渲染 SVG
    const { svg } = await mermaid.render(uniqueId, code)

    // 如果需要背景色，修改 SVG
    let processedSvg = svg
    if (backgroundColor && backgroundColor !== 'transparent') {
      processedSvg = svg.replace(
        /<svg/,
        `<svg style="background-color:${backgroundColor}"`
      )
    }

    // 缓存结果
    mermaidCache.set(cacheKey, processedSvg)

    return { svg: processedSvg }
  } catch (error) {
    console.error('Mermaid rendering error:', error)
    return {
      svg: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export function clearMermaidCache(): void {
  mermaidCache.clear()
}
