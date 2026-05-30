/**
 * GRIND App — Convex Task Functions
 * Source: PRD v2.0 Section 4.2
 *
 * Functions: listTasks, listAllTasks, getUpcomingTasks,
 *            getTaskCounts, createTask, updateTask,
 *            updateTaskStatus, deleteTask
 */

import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * List tasks by folder, sorted by deadline ascending (nearest first).
 */
export const listTasks = query({
  args: { folderId: v.id('folders') },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_folder', (q) => q.eq('folderId', args.folderId))
      .collect();

    // Sort by deadline ascending (nearest deadline first)
    return tasks.sort((a, b) => a.deadline - b.deadline);
  },
});

/**
 * List ALL tasks for a user, sorted by deadline ascending.
 */
export const listAllTasks = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    // Sort by deadline ascending
    return tasks.sort((a, b) => a.deadline - b.deadline);
  },
});

/**
 * Get the 3 nearest upcoming tasks (status != DONE).
 * Used on the Home screen "UPCOMING DEADLINES" section.
 */
export const getUpcomingTasks = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.neq(q.field('status'), 'DONE'))
      .collect();

    // Sort by deadline ascending, take first 3
    return tasks
      .sort((a, b) => a.deadline - b.deadline)
      .slice(0, 3);
  },
});

/**
 * Get task counts per status for a folder.
 * Used for status counter pills in Folder Workspace.
 * Returns: { todo, inProgress, done }
 */
export const getTaskCounts = query({
  args: { folderId: v.id('folders') },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_folder', (q) => q.eq('folderId', args.folderId))
      .collect();

    return {
      todo: tasks.filter((t) => t.status === 'TODO').length,
      inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      done: tasks.filter((t) => t.status === 'DONE').length,
    };
  },
});

/**
 * Create a new task in a folder.
 */
export const createTask = mutation({
  args: {
    folderId: v.id('folders'),
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    deadline: v.number(),
    status: v.union(
      v.literal('TODO'),
      v.literal('IN_PROGRESS'),
      v.literal('DONE'),
    ),
    tags: v.array(v.string()),
    isUrgent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert('tasks', {
      folderId: args.folderId,
      userId: args.userId,
      title: args.title,
      description: args.description,
      deadline: args.deadline,
      status: args.status,
      tags: args.tags,
      isUrgent: args.isUrgent,
    });
    return taskId;
  },
});

/**
 * Update task fields (not status — use updateTaskStatus for that).
 */
export const updateTask = mutation({
  args: {
    id: v.id('tasks'),
    title: v.string(),
    description: v.optional(v.string()),
    deadline: v.number(),
    tags: v.array(v.string()),
    isUrgent: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      deadline: args.deadline,
      tags: args.tags,
      isUrgent: args.isUrgent,
    });
  },
});

/**
 * Update task status only (TODO → IN_PROGRESS → DONE).
 * Used by checkbox toggle in task cards.
 */
export const updateTaskStatus = mutation({
  args: {
    id: v.id('tasks'),
    status: v.union(
      v.literal('TODO'),
      v.literal('IN_PROGRESS'),
      v.literal('DONE'),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
    });
  },
});

/**
 * Delete a task permanently.
 */
export const deleteTask = mutation({
  args: { id: v.id('tasks') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
