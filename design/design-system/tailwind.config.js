/**
 * AXIALENT — Tailwind config
 * Drop into a Tailwind v3+ project. Pair with `tokens.css` for runtime variables.
 *   import './tokens.css';
 *   module.exports = require('./tailwind.config.js');
 */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ink: {
          50:  '#F4F5F8',
          100: '#E6E9F0',
          200: '#C8CEDD',
          300: '#99A3BC',
          400: '#6B7796',
          500: '#475270',
          600: '#2F3A57',
          700: '#25324F',
          800: '#1D2F5E',
          900: '#0F1A38',
          950: '#070D20',
          DEFAULT: '#1D2F5E',
        },
        amber: {
          50:  '#FEF8E9',
          100: '#FCEDC2',
          200: '#F9DC8A',
          300: '#F6C957',
          400: '#F3B230',
          500: '#D9962A',
          600: '#B07920',
          700: '#855B18',
          DEFAULT: '#F3B230',
        },
        cyan:   { DEFAULT: '#3CB3D6' },
        cobalt: { DEFAULT: '#2275AA' },
        paper: {
          1: '#FBFAF6',
          2: '#F5F3EC',
          3: '#ECE9DF',
          DEFAULT: '#FBFAF6',
        },
        // Semantic shortcuts (point at CSS vars so theme switching works)
        bg:        'var(--ax-bg)',
        surface:   'var(--ax-surface)',
        text:      'var(--ax-text)',
        muted:     'var(--ax-text-muted)',
        border:    'var(--ax-border)',
        accent:    'var(--ax-accent)',
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans:    ['"Albert Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs':  ['11px', { lineHeight: '1.4'  }],
        xs:     ['12px', { lineHeight: '1.45' }],
        sm:     ['13px', { lineHeight: '1.5'  }],
        base:   ['15px', { lineHeight: '1.55' }],
        md:     ['16px', { lineHeight: '1.55' }],
        lg:     ['18px', { lineHeight: '1.5'  }],
        xl:     ['22px', { lineHeight: '1.35' }],
        '2xl':  ['28px', { lineHeight: '1.25' }],
        '3xl':  ['36px', { lineHeight: '1.15' }],
        '4xl':  ['48px', { lineHeight: '1.1'  }],
        '5xl':  ['64px', { lineHeight: '1.05' }],
      },
      letterSpacing: {
        tight:    '-0.02em',
        eyebrow:  '0.14em',
      },
      spacing: {
        0:  '0',
        1:  '4px',
        2:  '8px',
        3:  '12px',
        4:  '16px',
        5:  '24px',
        6:  '32px',
        7:  '40px',
        8:  '48px',
        9:  '64px',
        10: '80px',
        11: '96px',
      },
      borderRadius: {
        xs:   '2px',
        sm:   '4px',
        md:   '8px',
        lg:   '12px',
        xl:   '20px',
        '2xl':'28px',
        pill: '9999px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(29,47,94,0.04)',
        sm: '0 1px 3px rgba(29,47,94,0.06), 0 1px 2px rgba(29,47,94,0.04)',
        md: '0 4px 12px rgba(29,47,94,0.06), 0 2px 4px rgba(29,47,94,0.04)',
        lg: '0 12px 32px rgba(29,47,94,0.08), 0 4px 8px rgba(29,47,94,0.04)',
        xl: '0 24px 64px rgba(29,47,94,0.12)',
      },
      transitionTimingFunction: {
        standard:   'cubic-bezier(0.2, 0.8, 0.2, 1)',
        emphasized: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        fast: '120ms',
        base: '200ms',
        slow: '360ms',
      },
    },
  },
  plugins: [],
};
