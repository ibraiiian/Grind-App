/**
 * GRIND App — Deadline Badge
 * Source: PRD v2.0 Section 6.4
 *
 * Color-coded badge showing remaining time until deadline.
 * urgent: red bg + red text
 * warning: dark bg + gray text  
 * safe: dark bg + gray text
 * done: gray text "selesai"
 */

import { View, Text } from 'react-native';
import {
  getDeadlineStatus,
  getDeadlineLabel,
  type DeadlineStatus,
} from '@/lib/deadline';
import { colors } from '@/constants/colors';

interface DeadlineBadgeProps {
  deadline: number;
  status: string;
  isUrgent: boolean;
}

const badgeStyles: Record<DeadlineStatus, { bg: string; text: string; border?: string }> = {
  urgent: { bg: colors.urgentBg, text: colors.urgent, border: 'rgba(239, 68, 68, 0.3)' },
  warning: { bg: colors.warningBg, text: colors.gray500 },
  safe: { bg: colors.safeBg, text: colors.safe },
  done: { bg: colors.gray950, text: colors.done },
};

export function DeadlineBadge({ deadline, status, isUrgent }: DeadlineBadgeProps) {
  const isDone = status === 'DONE';
  const deadlineStatus = getDeadlineStatus(deadline, isDone, isUrgent);
  const label = getDeadlineLabel(deadline, status);
  const style = badgeStyles[deadlineStatus];

  return (
    <View
      className="rounded-lg px-2.5 py-1"
      style={{
        backgroundColor: style.bg,
        borderWidth: style.border ? 1 : 0,
        borderColor: style.border ?? 'transparent',
      }}
    >
      <Text
        className="text-xs font-medium"
        style={{ color: style.text }}
      >
        {label}
      </Text>
    </View>
  );
}
