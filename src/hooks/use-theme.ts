import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'

const THEME_KEY = 'theme-preference'

function getSavedTheme(): 'light' | 'dark' {
  try { return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light' } catch { return 'light' }
}

export function useTheme() {
  const [theme, setThemeKV] = useKV<'light' | 'dark'>('theme', getSavedTheme())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Apply saved theme immediately before useKV loads to avoid flash
    const saved = getSavedTheme()
    if (saved === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const resolved = theme || getSavedTheme()
    if (resolved === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    try { localStorage.setItem(THEME_KEY, resolved) } catch {}
  }, [theme, mounted])

  const toggleTheme = () => {
    setThemeKV(current => {
      const next = (current || getSavedTheme()) === 'light' ? 'dark' : 'light'
      try { localStorage.setItem(THEME_KEY, next) } catch {}
      return next
    })
  }

  return {
    theme,
    toggleTheme,
    setTheme: setThemeKV,
    mounted
  }
}
