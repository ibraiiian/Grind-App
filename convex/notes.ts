/**
 * GRIND App — Convex Note Functions
 * Source: PRD v2.0 Section 4.2
 *
 * Functions: listNotes, getNote, createNote, updateNote, deleteNote
 */

import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * List notes by folder, sorted by creation time descending.
 * Used in Folder Workspace → Notes tab.
 */
export const listNotes = query({
  args: { folderId: v.id('folders') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('notes')
      .withIndex('by_folder', (q) => q.eq('folderId', args.folderId))
      .order('desc')
      .collect();
  },
});

/**
 * Get a single note by ID.
 * Used when opening the note editor.
 */
export const getNote = query({
  args: { id: v.id('notes') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Create a new note in a folder.
 */
export const createNote = mutation({
  args: {
    folderId: v.id('folders'),
    userId: v.string(),
    title: v.string(),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const noteId = await ctx.db.insert('notes', {
      folderId: args.folderId,
      userId: args.userId,
      title: args.title,
      content: args.content,
    });
    return noteId;
  },
});

/**
 * Update a note — called by auto-save (debounced 1.5s).
 * Both title and content are optional patches.
 */
export const updateNote = mutation({
  args: {
    id: v.id('notes'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patch: Record<string, string> = {};
    if (args.title !== undefined) patch.title = args.title;
    if (args.content !== undefined) patch.content = args.content;

    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(args.id, patch);
    }
  },
});

/**
 * Delete a note permanently.
 */
export const deleteNote = mutation({
  args: { id: v.id('notes') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
