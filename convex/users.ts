/**
 * GRIND App — Convex User Functions
 * Source: PRD v2.0 Section 4.2
 *
 * Functions: getUser, getUserStats, upsertUser, updatePushToken
 */

import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * Get a single user by Clerk ID.
 */
export const getUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_clerk', (q) => q.eq('clerkId', args.clerkId))
      .first();
  },
});

/**
 * Get user stats for the Profile screen.
 * Returns counts of tasks, active folders, and prompts.
 */
export const getUserStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Count all tasks for user
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    // Count active (non-archived) folders for user
    const folders = await ctx.db
      .query('folders')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('isArchived'), false))
      .collect();

    // Count all prompts for user
    const prompts = await ctx.db
      .query('aiPrompts')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    return {
      taskCount: tasks.filter((t) => t.status !== 'DONE').length,
      folderCount: folders.length,
      promptCount: prompts.length,
    };
  },
});

/**
 * Upsert user — create if not exists, update if exists.
 * Called after Clerk sign-in/sign-up.
 */
export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (existingUser) {
      // User exists — update email and name
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
      });
      return existingUser._id;
    } else {
      // New user — insert
      const userId = await ctx.db.insert('users', {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
      });
      return userId;
    }
  },
});

/**
 * Update the user's Expo push notification token.
 * Called when the app registers for push notifications.
 */
export const updatePushToken = mutation({
  args: {
    clerkId: v.string(),
    expoPushToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (user) {
      await ctx.db.patch(user._id, {
        expoPushToken: args.expoPushToken,
      });
    }
  },
});
