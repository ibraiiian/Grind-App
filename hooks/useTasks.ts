/**
 * GRIND App — Tasks Hook
 * Source: PRD v2.0 Section 3.1 FR-1.5
 *
 * Provides task queries and mutations.
 * useUpcomingTasks() — Home screen "UPCOMING DEADLINES" (top 3)
 * useTasks() — Folder workspace task list
 */

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@/lib/clerk';
import { Id } from '@/convex/_generated/dataModel';

/**
 * Get the 3 nearest upcoming tasks for the Home screen.
 */
export function useUpcomingTasks() {
  const { user } = useUser();
  const userId = user?.id ?? '';

  const tasks = useQuery(api.tasks.getUpcomingTasks, userId ? { userId } : 'skip');

  return { tasks };
}

/**
 * Get all tasks for a specific folder.
 */
export function useTasks(folderId: Id<'folders'>) {
  const tasks = useQuery(api.tasks.listTasks, { folderId });
  const createTask = useMutation(api.tasks.createTask);
  const updateTask = useMutation(api.tasks.updateTask);
  const updateStatus = useMutation(api.tasks.updateTaskStatus);
  const deleteTask = useMutation(api.tasks.deleteTask);

  return { tasks, createTask, updateTask, updateStatus, deleteTask };
}

/**
 * Get all tasks for the current user (Global Task List).
 */
export function useAllTasks() {
  const { user } = useUser();
  const userId = user?.id ?? '';

  const tasks = useQuery(api.tasks.listAllTasks, userId ? { userId } : 'skip');

  return { tasks };
}
