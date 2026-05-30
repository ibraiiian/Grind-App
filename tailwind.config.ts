/**
 * GRIND App — Tailwind CSS Config (NativeWind)
 * Source: PRD v2.0 Section 6.1
 *
 * Extends theme with all GRIND color tokens.
 */

import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── Core ──────────────────────────────────────
        black: '#000000',
        white: '#FFFFFF',

        // ─── Gray Scale ────────────────────────────────
        gray: {
          950: '#0A0A0A',
          900: '#111111',
          700: '#333333',
          500: '#888888',
          200: '#EEEEEE',
        },

        // ─── Deadline Colors ───────────────────────────
        urgent: {
          DEFAULT: '#EF4444',
          bg: '#2D0A0A',
          bar: '#EF4444',
        },
        warning: {
          DEFAULT: '#888888',
          bg: '#1A1A1A',
        },
        safe: {
          DEFAULT: '#555555',
          bg: '#111111',
        },

        // ─── Status ────────────────────────────────────
        done: '#444444',

        // ─── Accent ────────────────────────────────────
        accent: '#FFFFFF',
      },

      // ─── Spacing ──────────────────────────────────────
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },

      // ─── Border Radius ────────────────────────────────
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px',
        full: '9999px',
      },

      // ─── Font Size ────────────────────────────────────
      fontSize: {
        'screen-title': ['38px', { lineHeight: '44px', fontWeight: '900' }],
        'modal-title': ['30px', { lineHeight: '36px', fontWeight: '700' }],
        'section-header': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'card-title': ['17px', { lineHeight: '22px', fontWeight: '700' }],
        'body': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'timestamp': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'cta': ['17px', { lineHeight: '22px', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
};

export default config;
