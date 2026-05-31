/**
 * GRIND App — Convex Folder Functions
 * Source: PRD v2.0 Section 4.2
 *
 * Functions: listFolders, listArchivedFolders, createFolder,
 *            updateFolder, archiveFolder, deleteFolder (cascade)
 */

import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * List all active (non-archived) folders for a user.
 * Sorted by creation time descending (newest first).
 */
export const listFolders = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('folders')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect();
  },
});

/**
 * List all archived folders for a user.
 * Sorted by creation time descending.
 */
export const listArchivedFolders = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('folders')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('isArchived'), true))
      .order('desc')
      .collect();
  },
});

/**
 * Create a new folder.
 * isArchived defaults to false.
 */
export const createFolder = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    colorHex: v.string(),
    icon: v.string(),
  },
  handler: async (ctx, args) => {
    const folderId = await ctx.db.insert('folders', {
      userId: args.userId,
      name: args.name,
      colorHex: args.colorHex,
      icon: args.icon,
      isArchived: false,
    });
    return folderId;
  },
});

/**
 * Update folder name, color, and/or icon.
 */
export const updateFolder = mutation({
  args: {
    id: v.id('folders'),
    name: v.string(),
    colorHex: v.string(),
    icon: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name,
      colorHex: args.colorHex,
      icon: args.icon,
    });
  },
});

/**
 * Archive a folder (soft delete).
 * Archived folders don't appear in the main grid.
 */
export const archiveFolder = mutation({
  args: { id: v.id('folders') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isArchived: true });
  },
});

/**
 * Delete a folder with CASCADE delete.
 * Removes ALL child records: tasks, notes, and aiPrompts.
 */
export const deleteFolder = mutation({
  args: { id: v.id('folders') },
  handler: async (ctx, args) => {
    // 1. Delete all tasks in folder
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_folder', (q) => q.eq('folderId', args.id))
      .collect();
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    // 2. Delete all notes in folder
    const notes = await ctx.db
      .query('notes')
      .withIndex('by_folder', (q) => q.eq('folderId', args.id))
      .collect();
    for (const note of notes) {
      await ctx.db.delete(note._id);
    }

    // 3. Delete all prompts in folder
    const prompts = await ctx.db
      .query('aiPrompts')
      .withIndex('by_folder', (q) => q.eq('folderId', args.id))
      .collect();
    for (const prompt of prompts) {
      await ctx.db.delete(prompt._id);
    }

    // 4. Delete the folder itself
    await ctx.db.delete(args.id);
  },
});

/**
 * Get a specific folder by ID.
 */
export const getFolder = query({
  args: { id: v.id('folders') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
