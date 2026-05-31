/**
 * GRIND App — Inbox Hook
 * Source: PRD v2.0 Section 3.1 FR-1.4
 *
 * Provides inbox items (Quick Capture) with CRUD operations.
 * Data is realtime via Convex useQuery.
 */

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@/lib/clerk';

export function useInbox() {
  const { user } = useUser();
  const userId = user?.id ?? '';

  const items = useQuery(api.inbox.listInbox, userId ? { userId } : 'skip');
  const createItem = useMutation(api.inbox.createInboxItem);
  const deleteItem = useMutation(api.inbox.deleteInboxItem);
  const processItem = useMutation(api.inbox.processInboxItem);

  return { items, createItem, deleteItem, processItem, userId };
}
