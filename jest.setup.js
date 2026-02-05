// Setup file for Jest mocks

jest.mock('mermaid', () => {
  const mockMermaid = {
    initialized: false,
    currentTheme: 'default',
    currentBackgroundColor: 'transparent',
    initialize: jest.fn().mockImplementation(async (config) => {
      mockMermaid.initialized = true
      // Store config for use in render
      if (config) {
        mockMermaid.currentTheme = config.theme || 'default'
        mockMermaid.currentBackgroundColor = config.backgroundColor || 'transparent'
      }
      return mockMermaid
    }),
    render: jest.fn().mockImplementation(async (id, code) => {
      // Simulate error for invalid syntax
      if (code.includes('invalid') || code.trim().startsWith('invalid')) {
        throw new Error('Syntax error in mermaid diagram')
      }

      // Use a simple hash to create a deterministic ID that includes theme and backgroundColor
      const simpleHash = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) +
                       mockMermaid.currentTheme.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) +
                       mockMermaid.currentBackgroundColor.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const deterministicId = `mermaid-${simpleHash}`

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" id="${deterministicId}">
  <rect x="0" y="0" width="100" height="50" fill="${mockMermaid.currentBackgroundColor}"/>
  <text x="50" y="25" text-anchor="middle" font-size="12">Mermaid Diagram (${mockMermaid.currentTheme})</text>
</svg>`
      return { svg }
    })
  }
  return mockMermaid
}, { virtual: true })

jest.mock('remark-parse', () => {
  return jest.fn().mockImplementation(() => (tree) => {
    return tree
  })
}, { virtual: true })
