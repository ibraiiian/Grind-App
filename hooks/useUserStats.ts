import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@/lib/clerk';

export function useUserStats() {
  const { user } = useUser();
  const stats = useQuery(
    api.users.getUserStats,
    user?.id ? { userId: user.id } : 'skip'
  );
  return { stats };
}

export function useUpsertUser() {
  const upsertUser = useMutation(api.users.upsertUser);
  const updatePushToken = useMutation(api.users.updatePushToken);
  return { upsertUser, updatePushToken };
}
