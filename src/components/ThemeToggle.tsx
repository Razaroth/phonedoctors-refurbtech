import { Moon, Sun } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { useTheme } from '@/hooks/use-theme'

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="shrink-0">
        <Sun size={20} />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="shrink-0"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={20} weight="fill" />
      ) : (
        <Sun size={20} weight="fill" />
      )}
    </Button>
  )
}
