import { useEffect } from 'react'

/**
 * Storybook decorator that applies dark mode (and an optional theme class) to
 * `document.documentElement` so that portal-rendered popups (Select, DropdownMenu,
 * Popover, etc.) inherit the correct CSS custom properties.
 *
 * The wrapper `<div>` also receives the same classes so the story canvas
 * background matches the expected dark-mode appearance.
 *
 * @param themeClass – Optional Tailwind/CSS theme class (e.g. `'theme-cyber-chat'`).
 */
export const withDarkMode =
  (themeClass?: string) =>
  function DarkModeDecorator(Story: React.FC) {
    useEffect(() => {
      const classes: string[] = ['dark']
      if (themeClass) classes.push(themeClass)
      document.documentElement.classList.add(...classes)
      return () => {
        document.documentElement.classList.remove(...classes)
      }
    }, [])

    const wrapperClass = ['dark', 'bg-background', 'p-8', themeClass]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={wrapperClass}>
        <Story />
      </div>
    )
  }
