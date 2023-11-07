import * as React from 'react'
import { Moon, Sun, Computer } from 'lucide-react'

const MODE = ['theme-light', 'dark', 'system'] as const

function ToogleThemeMode() {
  const [theme, setThemeState] = React.useState<
    'theme-light' | 'dark' | 'system'
  >('theme-light')

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setThemeState(isDarkMode ? 'dark' : 'theme-light')
  }, [])

  React.useEffect(() => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList[isDark ? 'add' : 'remove']('dark')
  }, [theme])

  return (
    <div className='flex gap-2 items-center'>
      {MODE.map((mode) => (
        <button
          key={mode}
          className={
            theme === mode
              ? 'duration-200 p-1 rounded-md ring-2 ring-primary'
              : ''
          }
          onClick={() => setThemeState(mode)}
        >
          {mode === 'theme-light' && <Sun />}
          {mode === 'dark' && <Moon />}
        </button>
      ))}
    </div>
  )
}

export default ToogleThemeMode
