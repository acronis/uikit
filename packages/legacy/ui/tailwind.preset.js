/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  theme: {
    extend: {
      // Register all container breakpoints as theme screens so they exist in v4's
      // --breakpoint-* namespace even when tailwindcss/theme.css is not loaded.
      // Without this, container.screens references cause a sort crash in v4.2.2.
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
        '3xl': '1920px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2.5rem',
          '2xl': '3rem',
          '3xl': '3rem',
        },
      },
      fontFamily: {
        sans: [
          'var(--av-font-sans)',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      fontSize: {
        base: [
          'var(--av-font-size-base, 16px)',
          { lineHeight: 'var(--av-line-height-base, 1.5)' },
        ],
      },
      lineHeight: {
        base: 'var(--av-line-height-base, 1.5)',
      },
      letterSpacing: {
        base: 'var(--av-letter-spacing-base, 0)',
      },
      colors: {
        background: 'hsl(var(--av-background))',
        foreground: 'hsl(var(--av-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--av-primary))',
          foreground: 'hsl(var(--av-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--av-secondary))',
          foreground: 'hsl(var(--av-secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--av-muted))',
          foreground: 'hsl(var(--av-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--av-accent))',
          foreground: 'hsl(var(--av-accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--av-destructive))',
          foreground: 'hsl(var(--av-destructive-foreground))',
          light: 'hsl(var(--av-status-danger-bg))',
          accent: 'hsl(var(--av-status-danger))',
        },
        danger: {
          DEFAULT: 'hsl(var(--av-status-danger-bg))',
          foreground: 'hsl(var(--av-status-danger-text))',
          accent: 'hsl(var(--av-status-danger))',
        },
        success: {
          DEFAULT: 'hsl(var(--av-status-success-bg))',
          foreground: 'hsl(var(--av-status-success-text))',
          accent: 'hsl(var(--av-status-success))',
        },
        warning: {
          DEFAULT: 'hsl(var(--av-status-warning-bg))',
          foreground: 'hsl(var(--av-status-warning-text))',
          accent: 'hsl(var(--av-status-warning))',
        },
        info: {
          DEFAULT: 'hsl(var(--av-status-info-bg))',
          foreground: 'hsl(var(--av-status-info-text))',
          accent: 'hsl(var(--av-status-info))',
        },
        critical: {
          DEFAULT: 'hsl(var(--av-status-critical-bg))',
          foreground: 'hsl(var(--av-status-critical-text))',
          accent: 'hsl(var(--av-status-critical))',
        },
        neutral: {
          DEFAULT: 'hsl(var(--av-status-neutral-bg))',
          foreground: 'hsl(var(--av-status-neutral-text))',
          accent: 'hsl(var(--av-status-neutral))',
        },
        ai: {
          DEFAULT: 'hsl(var(--av-status-ai-bg))',
          foreground: 'hsl(var(--av-status-ai-text))',
          accent: 'hsl(var(--av-status-ai))',
        },
        popover: {
          DEFAULT: 'hsl(var(--av-popover))',
          foreground: 'hsl(var(--av-popover-foreground))',
        },
        tooltip: {
          DEFAULT: 'hsl(var(--av-tooltip))',
          foreground: 'hsl(var(--av-text-inverse))',
        },
        card: {
          DEFAULT: 'hsl(var(--av-elevated))',
          foreground: 'hsl(var(--av-foreground))',
        },
        border: 'hsl(var(--av-border))',
        input: 'hsl(var(--av-input))',
        ring: 'hsl(var(--av-ring))',
        sidebar: {
          DEFAULT: 'hsl(var(--av-nav-bg))',
          foreground: 'hsl(var(--av-nav-text))',
          primary: 'hsl(var(--av-nav-bg))',
          'primary-foreground': 'hsl(var(--av-text-inverse))',
          accent: 'hsl(var(--av-nav-active))',
          'accent-foreground': 'hsl(var(--av-text-inverse))',
          border: 'hsl(var(--av-nav-bg))',
          ring: 'hsl(var(--av-ring))',
        },
      },
      translate: {
        'dialog-offset': '48%',
      },
      borderRadius: {
        lg: 'var(--av-radius)',
        md: 'calc(var(--av-radius) - 2px)',
        sm: 'calc(var(--av-radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--accordion-panel-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--accordion-panel-height)',
          },
          to: {
            height: '0',
          },
        },
        'indeterminate-progress': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'indeterminate-progress': 'indeterminate-progress 1.5s ease-in-out infinite',
      },
    },
  },
};
