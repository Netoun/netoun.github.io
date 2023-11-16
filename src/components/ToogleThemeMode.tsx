import * as React from "react"
import { cn } from "src/utils"

const MODE = ["theme-light", "dark", "system"] as const

function ToogleThemeMode() {
  const [theme, setThemeState] = React.useState<
    "theme-light" | "dark" | "system"
  >("theme-light")

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setThemeState(isDarkMode ? "dark" : "theme-light")
  }, [])

  React.useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    document.documentElement.classList[isDark ? "add" : "remove"]("dark")
  }, [theme])

  return (
    <div className='relative flex gap-4 items-center'>
      <img
        src='/images/highlight.webp'
        className={cn("absolute w-14 dark:invert-[1] duration-200", {
          "-translate-x-3": theme === "theme-light",
          "translate-x-9": theme === "dark"
        })}
      />
      {MODE.map((mode) => (
        <button
          key={mode}
          className={cn("duration-200")}
          onClick={() => setThemeState(mode)}
        >
          <span className='sr-only'>{mode}</span>
          {mode === "theme-light" && (
            <img src='/images/sun.webp' className='dark:invert-[1] w-9 h-9' />
          )}
          {mode === "dark" && (
            <img src='/images/moon.webp' className='dark:invert-[1] w-8 h-8' />
          )}
        </button>
      ))}
    </div>
  )
}

export default ToogleThemeMode
