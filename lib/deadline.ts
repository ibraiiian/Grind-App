/**
 * GRIND App — Smart Deadline Utilities
 * Source: PRD v2.0 Section 7.2 & 6.4
 *
 * Deadline color coding + urgency grouping + label formatting
 */

import { differenceInHours, differenceInMinutes } from 'date-fns';
import { colors } from '../constants/colors';

// ─── Types ────────────────────────────────────────────

export type DeadlineStatus = 'urgent' | 'warning' | 'safe' | 'done';

export type TaskForGrouping = {
  deadline: number;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  isUrgent: boolean;
  [key: string]: unknown;
};

// ─── Deadline Status ──────────────────────────────────

/**
 * Determines the deadline status based on remaining time,
 * completion status, and manual urgent flag.
 *
 * Priority:
 * 1. isDone → 'done'
 * 2. isUrgent (manual flag) → 'urgent'
 * 3. <24h remaining → 'urgent'
 * 4. 24-72h remaining → 'warning'
 * 5. >72h remaining → 'safe'
 */
export function getDeadlineStatus(
  deadline: number,
  isDone: boolean,
  isUrgent: boolean,
): DeadlineStatus {
  if (isDone) return 'done';
  if (isUrgent) return 'urgent';

  const hoursLeft = differenceInHours(new Date(deadline), new Date());

  if (hoursLeft < 24) return 'urgent';
  if (hoursLeft < 72) return 'warning';
  return 'safe';
}

// ─── Deadline Color Maps ──────────────────────────────

/**
 * Maps DeadlineStatus to text color.
 * See PRD v2 Section 6.4.
 */
export const deadlineColor: Record<DeadlineStatus, string> = {
  urgent: colors.urgent,    // #EF4444
  warning: colors.warning,  // #888888
  safe: colors.safe,        // #555555
  done: colors.done,        // #444444
};

/**
 * Maps DeadlineStatus to background color for badges.
 */
export const deadlineBgColor: Record<DeadlineStatus, string> = {
  urgent: colors.urgentBg,  // #2D0A0A
  warning: colors.warningBg, // #1A1A1A
  safe: colors.safeBg,      // #111111
  done: colors.gray950,     // #0A0A0A
};

/**
 * Maps DeadlineStatus to left accent bar color (or null).
 */
export const deadlineBarColor: Record<DeadlineStatus, string | null> = {
  urgent: colors.urgentBar, // #EF4444
  warning: null,
  safe: null,
  done: null,
};

// ─── Deadline Label ───────────────────────────────────

/**
 * Returns a human-readable deadline label in Bahasa Indonesia.
 *
 * Examples:
 * - '45 menit lagi'
 * - '4 jam lagi'
 * - '2 hari lagi'
 * - 'selesai'
 * - 'lewat!' (overdue)
 */
export function getDeadlineLabel(deadline: number, status: string): string {
  if (status === 'DONE') return 'selesai';

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const minutesLeft = differenceInMinutes(deadlineDate, now);

  if (minutesLeft < 0) return 'terlambat';
  if (minutesLeft < 60) return `${minutesLeft} menit lagi`;

  const hoursLeft = differenceInHours(deadlineDate, now);
  if (hoursLeft < 24) return `${hoursLeft} jam lagi`;

  const daysLeft = Math.ceil(hoursLeft / 24);
  if (daysLeft === 1) return '1 hari lagi';
  return `${daysLeft} hari lagi`;
}

// ─── Task Grouping ────────────────────────────────────

/**
 * Groups tasks by urgency level for the Global Task List.
 * Sections: urgent (🔴), thisWeek (⏳), done (✓)
 *
 * - urgent: tasks with <24h deadline OR manually flagged urgent (NOT DONE)
 * - thisWeek: tasks with warning/safe status (NOT DONE)
 * - done: all completed tasks
 *
 * Sections only appear if they have items.
 */
export function groupTasksByUrgency<T extends TaskForGrouping>(tasks: T[]) {
  return {
    urgent: tasks.filter(
      (t) =>
        getDeadlineStatus(t.deadline, t.status === 'DONE', t.isUrgent) ===
          'urgent' && t.status !== 'DONE',
    ),
    thisWeek: tasks.filter((t) => {
      const status = getDeadlineStatus(
        t.deadline,
        t.status === 'DONE',
        t.isUrgent,
      );
      return (status === 'warning' || status === 'safe') && t.status !== 'DONE';
    }),
    done: tasks.filter((t) => t.status === 'DONE'),
  };
}

export function buildTaskSections<T extends TaskForGrouping>(tasks: T[], filter: string) {
  let filtered = tasks;

  if (filter === 'urgent') {
    filtered = tasks.filter(t =>
      getDeadlineStatus(t.deadline, t.status === 'DONE', t.isUrgent) === 'urgent' && t.status !== 'DONE'
    );
  } else if (filter === 'today') {
    filtered = tasks.filter(t => {
      const d = new Date(t.deadline);
      const today = new Date();
      return d.toDateString() === today.toDateString() && t.status !== 'DONE';
    });
  } else if (filter === 'thisWeek') {
    filtered = tasks.filter(t => {
      const h = differenceInHours(new Date(t.deadline), new Date());
      return h >= 0 && h <= 168 && t.status !== 'DONE';
    });
  } else if (filter === 'done') {
    filtered = tasks.filter(t => t.status === 'DONE');
    return [{ title: 'done', icon: 'checkmark', data: filtered }];
  }

  // Group by urgency for 'all' and other dynamic filters (though if urgent is selected, thisWeek will be empty)
  const grouped = groupTasksByUrgency(filtered);
  const sections = [];
  
  if (grouped.urgent.length > 0)
    sections.push({ title: 'urgent', icon: 'urgent-dot', data: grouped.urgent });
  if (grouped.thisWeek.length > 0)
    sections.push({ title: 'this week', icon: 'timer-outline', data: grouped.thisWeek });
  if (grouped.done.length > 0)
    sections.push({ title: 'done', icon: 'checkmark', data: grouped.done });
    
  return sections;
}
