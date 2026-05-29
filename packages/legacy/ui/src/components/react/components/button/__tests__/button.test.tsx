import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/react/components/button/button.tsx'

describe('Button', () => {
  describe('Rendering', () => {
    it('renders properly', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('renders as button element by default', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      expect(button.tagName).toBe('BUTTON')
    })

    it('applies custom className', () => {
      render(<Button className="custom-class">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('Variants', () => {
    it('applies default variant', () => {
      render(<Button>Default</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary')
    })

    it('applies destructive variant', () => {
      render(<Button variant="destructive">Destructive</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-destructive')
    })

    it('applies outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border', 'border-input')
    })

    it('applies secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary')
    })

    it('applies ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-accent')
    })

    it('applies link variant', () => {
      render(<Button variant="link">Link</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-primary', 'underline-offset-4')
    })

    it('applies success variant', () => {
      render(<Button variant="success">Success</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-success')
    })

    it('applies warning variant', () => {
      render(<Button variant="warning">Warning</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-warning')
    })

    it('applies info variant', () => {
      render(<Button variant="info">Info</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-info')
    })
  })

  describe('Sizes', () => {
    it('applies default size', () => {
      render(<Button>Default</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10', 'px-4', 'py-2')
    })

    it('applies small size', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9', 'px-3')
    })

    it('applies large size', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-11', 'px-8')
    })

    it('applies icon size', () => {
      render(<Button size="icon">Icon</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10', 'w-10')
    })
  })

  describe('Events', () => {
    it('handles click events', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)

      await userEvent.click(screen.getByText('Click me'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not trigger click when disabled', async () => {
      const handleClick = vi.fn()
      render(
        <Button onClick={handleClick} disabled>
          Click me
        </Button>
      )

      await userEvent.click(screen.getByText('Click me'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('States', () => {
    it('applies disabled state', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
    })

    it('applies disabled attribute', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('disabled')
    })
  })

  describe('asChild prop', () => {
    it('renders as Slot when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      )
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
    })

    it('applies button classes to child element when asChild is true', () => {
      render(
        <Button asChild variant="destructive" size="lg">
          <a href="/test">Link Button</a>
        </Button>
      )
      const link = screen.getByRole('link')
      expect(link).toHaveClass('bg-destructive', 'h-11', 'px-8')
    })
  })

  describe('Ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(<Button ref={ref}>Button</Button>)
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it('allows ref access to button methods', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(<Button ref={ref}>Button</Button>)
      expect(ref.current?.click).toBeDefined()
      expect(ref.current?.focus).toBeDefined()
    })
  })

  describe('HTML attributes', () => {
    it('passes through native button attributes', () => {
      render(
        <Button type="submit" name="submit-button" value="submit">
          Submit
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('name', 'submit-button')
      expect(button).toHaveAttribute('value', 'submit')
    })

    it('applies aria attributes', () => {
      render(
        <Button aria-label="Close dialog" aria-pressed="true">
          Close
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Close dialog')
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })
  })
})
