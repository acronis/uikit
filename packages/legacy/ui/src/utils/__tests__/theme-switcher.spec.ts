import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  applyTheme,
  getCurrentTheme,
} from '../theme-switcher'

function makeContainer(): HTMLElement {
  const el = document.createElement('div')
  document.body.appendChild(el)
  return el
}

function cleanup(container: HTMLElement): void {
  document.body.removeChild(container)
}

beforeEach(() => {
  document.documentElement.className = ''
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

// ---------------------------------------------------------------------------
// applyTheme
// ---------------------------------------------------------------------------

describe('applyTheme', () => {
  describe('without extraRoots', () => {
    it('should add theme class to document.documentElement', () => {
      applyTheme('acronis-ocean')

      expect(document.documentElement.classList.contains('theme-acronis-ocean')).toBe(true)
    })

    it('should remove previous theme class from document.documentElement', () => {
      applyTheme('acronis-default')
      applyTheme('acronis-ocean')

      expect(document.documentElement.classList.contains('theme-acronis-default')).toBe(false)
    })

    it('should persist theme to localStorage when persist is true', () => {
      applyTheme('acronis-ocean', true)

      expect(localStorage.getItem('av-theme')).toBe('acronis-ocean')
    })

    it('should not persist theme to localStorage when persist is false', () => {
      applyTheme('acronis-ocean', false)

      expect(localStorage.getItem('av-theme')).toBeNull()
    })

    it('should remove previous theme class when switching to a white-label variant', () => {
      applyTheme('ingram-micro')
      applyTheme('purple')

      expect(document.documentElement.classList.contains('theme-ingram-micro')).toBe(false)
      expect(document.documentElement.classList.contains('theme-purple')).toBe(true)
    })
  })

  describe('with extraRoots', () => {
    it('should add theme class to the extra root element', () => {
      const container = makeContainer()

      applyTheme('acronis-ocean', false, [container])

      expect(container.classList.contains('theme-acronis-ocean')).toBe(true)
      cleanup(container)
    })

    it('should add theme class to document.documentElement AND extra root', () => {
      const container = makeContainer()

      applyTheme('acronis-ocean', false, [container])

      expect(document.documentElement.classList.contains('theme-acronis-ocean')).toBe(true)
      cleanup(container)
    })

    it('should remove previous theme class from extra root when switching themes', () => {
      const container = makeContainer()
      applyTheme('acronis-default', false, [container])
      applyTheme('acronis-ocean', false, [container])

      expect(container.classList.contains('theme-acronis-default')).toBe(false)
      cleanup(container)
    })

    it('should apply theme to multiple extra roots independently', () => {
      const c1 = makeContainer()
      const c2 = makeContainer()

      applyTheme('acronis-ocean', false, [c1, c2])

      expect(c1.classList.contains('theme-acronis-ocean')).toBe(true)
      expect(c2.classList.contains('theme-acronis-ocean')).toBe(true)
      cleanup(c1)
      cleanup(c2)
    })

    it('should not affect extra root classes unrelated to theming', () => {
      const container = makeContainer()
      container.classList.add('my-custom-class')

      applyTheme('acronis-ocean', false, [container])

      expect(container.classList.contains('my-custom-class')).toBe(true)
      cleanup(container)
    })

    it('should still persist to localStorage when extraRoots are provided', () => {
      const container = makeContainer()

      applyTheme('acronis-ocean', true, [container])

      expect(localStorage.getItem('av-theme')).toBe('acronis-ocean')
      cleanup(container)
    })
  })
})

// ---------------------------------------------------------------------------
// getCurrentTheme
// ---------------------------------------------------------------------------

describe('getCurrentTheme', () => {
  it('should return the currently applied theme', () => {
    applyTheme('acronis-ocean', false)

    expect(getCurrentTheme()).toBe('acronis-ocean')
  })

  it('should return null when no theme class is present', () => {
    expect(getCurrentTheme()).toBeNull()
  })
})

describe('getCurrentTheme — white-label variants', () => {
  it('should return the white-label variant name as current theme', () => {
    applyTheme('ingram-micro', false)

    expect(getCurrentTheme()).toBe('ingram-micro')
  })

  it('should switch between white-label variants correctly', () => {
    applyTheme('purple', false)
    applyTheme('telstra', false)

    expect(getCurrentTheme()).toBe('telstra')
  })
})
