import React from 'react'

interface Theme {
  id: string
  name: string
}

interface ThemeSelectorProps {
  themes: Theme[]
  currentTheme: string
  onThemeChange: (themeId: string) => void
}

export default function ThemeSelectorComponent(props: ThemeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="theme-selector" className="text-sm font-medium text-gray-700">
        主题
      </label>
      <select
        id="theme-selector"
        value={props.currentTheme}
        onChange={(e) => props.onThemeChange(e.target.value)}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer hover:border-gray-400 transition-colors"
      >
        {props.themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  )
}
