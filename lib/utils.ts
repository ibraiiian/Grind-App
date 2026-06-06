/**
 * GRIND App — General Utilities
 * Source: PRD v2.0 Section 7.5
 */

import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

// ─── Class Name Merger (NativeWind) ───────────────────

/**
 * Merges class name strings for NativeWind.
 * Filters out falsy values for conditional classes.
 *
 * @example
 * cn('bg-black', isActive && 'border-white', undefined)
 * // → 'bg-black border-white'
 */
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(' ');
}

// ─── Relative Time Formatting ─────────────────────────

/**
 * Formats a timestamp to relative time string in Bahasa Indonesia.
 *
 * @example
 * formatRelativeTime(Date.now() - 300000)
 * // → '5 menit yang lalu'
 *
 * formatRelativeTime(Date.now() - 86400000)
 * // → 'kemarin'
 */
export function formatRelativeTime(date: Date | number): string {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: idLocale,
  });
}

// ─── Time-based Greeting ──────────────────────────────

/**
 * Returns a greeting string based on current hour.
 * Used in Home screen: 'good morning, {name} 👊'
 *
 * - 00:00 – 11:59 → 'good morning'
 * - 12:00 – 16:59 → 'good afternoon'
 * - 17:00 – 23:59 → 'good evening'
 */
export function getTimeGreeting(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 5) return 'good night';
  if (h < 12) return 'good morning';
  if (h < 17) return 'good afternoon';
  if (h < 21) return 'good evening';
  return 'good night';
}

// ─── User Initials ────────────────────────────────────

/**
 * Extracts initials from a full name string.
 * Returns '?' if name is empty/undefined.
 * Max 2 characters, uppercase.
 *
 * @example
 * getInitials('Ibrahim Bahaly') → 'IB'
 * getInitials('John')           → 'J'
 * getInitials(undefined)        → '?'
 */
export function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
