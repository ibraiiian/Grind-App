/**
 * GRIND App — Design Tokens (Color Palette)
 * Source: PRD v2.0 Section 6.1
 *
 * Dark-first, monochrome, Gen Z minimalist.
 * Accent utama adalah PUTIH (#FFFFFF), bukan purple.
 */

export const colors = {
  // ─── Core ──────────────────────────────────────────
  black: '#000000',       // Background utama (dark mode) - layar penuh
  white: '#FFFFFF',       // Text utama, CTA button bg, icon active

  // ─── Gray Scale ────────────────────────────────────
  gray950: '#0A0A0A',     // Background card, bottom sheet
  gray900: '#111111',     // Background input, secondary surfaces, toolbar
  gray700: '#333333',     // Border card, divider line
  gray500: '#888888',     // Placeholder text, timestamp, label kecil, inactive tab
  gray200: '#EEEEEE',     // Text sekunder di atas background gelap

  // ─── Deadline — Urgent (<24 jam) ───────────────────
  urgent: '#EF4444',      // Teks badge, left accent bar, section label
  urgentBg: '#2D0A0A',    // Background badge deadline urgent
  urgentBar: '#EF4444',   // Left accent bar task urgent (3-4px lebar)

  // ─── Deadline — Warning (24-72 jam) ────────────────
  warning: '#888888',     // Deadline 24-72 jam
  warningBg: '#1A1A1A',  // Background badge deadline warning

  // ─── Deadline — Safe (>72 jam) ─────────────────────
  safe: '#555555',        // Deadline >72 jam
  safeBg: '#111111',      // Background badge deadline safe

  // ─── Status ────────────────────────────────────────
  done: '#444444',        // Task DONE: teks + strikethrough

  // ─── Accent ────────────────────────────────────────
  accent: '#FFFFFF',      // Accent utama MVP: FAB, active tab, CTA - PUTIH
} as const;

export type ColorToken = keyof typeof colors;
