/**
 * GRIND App — Convex Inbox Functions
 * Source: PRD v2.0 Section 4.2
 *
 * Functions: listInbox, createInboxItem, deleteInboxItem, processInboxItem
 */

import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * List all unprocessed inbox items for a user.
 * Sorted by creation time descending (newest first).
 */
export const listInbox = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('inboxItems')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('isProcessed'), false))
      .order('desc')
      .collect();
  },
});

/**
 * Create a new inbox item (Quick Capture).
 * isProcessed defaults to false.
 */
export const createInboxItem = mutation({
  args: {
    userId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const itemId = await ctx.db.insert('inboxItems', {
      userId: args.userId,
      content: args.content,
      isProcessed: false,
    });
    return itemId;
  },
});

/**
 * Delete an inbox item permanently.
 */
export const deleteInboxItem = mutation({
  args: { id: v.id('inboxItems') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/**
 * Process an inbox item — mark as processed.
 * folderId stored for context (which folder it was sent to).
 */
export const processInboxItem = mutation({
  args: {
    id: v.id('inboxItems'),
    folderId: v.id('folders'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isProcessed: true,
    });
  },
});
