/**
 * GRIND App — Convex AI Prompt Functions
 * Source: PRD v2.0 Section 4.2
 *
 * Functions: listPrompts, listPromptsByFolder,
 *            createPrompt, updatePrompt, deletePrompt
 */

import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * List all prompts for a user, sorted by creation time descending.
 * Used in the global Prompt Vault screen.
 */
export const listPrompts = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('aiPrompts')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect();
  },
});

/**
 * List prompts scoped to a specific folder.
 * Used in Folder Workspace → Prompts tab.
 */
export const listPromptsByFolder = query({
  args: { folderId: v.id('folders') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('aiPrompts')
      .withIndex('by_folder', (q) => q.eq('folderId', args.folderId))
      .order('desc')
      .collect();
  },
});

/**
 * Create a new AI prompt template.
 * folderId is optional — prompts can be global.
 */
export const createPrompt = mutation({
  args: {
    userId: v.string(),
    folderId: v.optional(v.id('folders')),
    title: v.string(),
    promptTemplate: v.string(),
    tags: v.array(v.string()),
    icon: v.string(),
  },
  handler: async (ctx, args) => {
    const promptId = await ctx.db.insert('aiPrompts', {
      userId: args.userId,
      folderId: args.folderId,
      title: args.title,
      promptTemplate: args.promptTemplate,
      tags: args.tags,
      icon: args.icon,
    });
    return promptId;
  },
});

/**
 * Update an existing prompt.
 */
export const updatePrompt = mutation({
  args: {
    id: v.id('aiPrompts'),
    title: v.string(),
    promptTemplate: v.string(),
    tags: v.array(v.string()),
    icon: v.string(),
    folderId: v.optional(v.id('folders')),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      promptTemplate: args.promptTemplate,
      tags: args.tags,
      icon: args.icon,
      folderId: args.folderId,
    });
  },
});

/**
 * Delete a prompt permanently.
 */
export const deletePrompt = mutation({
  args: { id: v.id('aiPrompts') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/**
 * Get a single prompt by its ID.
 */
export const getPromptById = query({
  args: { id: v.id('aiPrompts') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
