/**
 * GRIND App — Convex Database Schema
 * Source: PRD v2.0 Section 4.1
 *
 * Semua field termasuk perubahan v2:
 *  - folders.icon (v.string())
 *  - tasks.tags (v.array(v.string()))
 *  - tasks.isUrgent (v.boolean())
 *  - aiPrompts.icon (v.string())
 *  - users.name (v.optional(v.string()))
 */

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  /**
   * Folders — Wadah konten berdasarkan Mata Kuliah / Proyek
   */
  folders: defineTable({
    userId: v.string(),            // Clerk userId
    name: v.string(),              // Nama folder
    colorHex: v.string(),          // Warna dot label (#000000)
    icon: v.string(),              // [v2 NEW] Icon key: 'crown' | 'bolt' | 'star' | 'starOutline' | 'smiley' | 'crazy'
    isArchived: v.boolean(),       // Default: false
  }).index('by_user', ['userId']),

  /**
   * Inbox Items — Quick Capture dari Home screen
   */
  inboxItems: defineTable({
    userId: v.string(),            // Clerk userId
    content: v.string(),           // Teks inbox item
    isProcessed: v.boolean(),      // Default: false
  }).index('by_user', ['userId']),

  /**
   * Tasks — Tugas dengan Smart Deadline
   */
  tasks: defineTable({
    folderId: v.id('folders'),     // Parent folder
    userId: v.string(),            // Clerk userId
    title: v.string(),             // Judul task
    description: v.optional(v.string()), // Deskripsi (optional)
    deadline: v.number(),          // Unix timestamp (ms)
    status: v.union(
      v.literal('TODO'),
      v.literal('IN_PROGRESS'),
      v.literal('DONE'),
    ),
    tags: v.array(v.string()),     // [v2 NEW] Array tag string, default []
    isUrgent: v.boolean(),         // [v2 NEW] Manual urgent flag, default false
  })
    .index('by_folder', ['folderId'])
    .index('by_user', ['userId'])
    .index('by_user_status', ['userId', 'status']),

  /**
   * AI Prompts — Template prompt dengan {{variable}} placeholders
   */
  aiPrompts: defineTable({
    userId: v.string(),            // Clerk userId
    folderId: v.optional(v.id('folders')), // nullable — prompt bisa global
    title: v.string(),             // Judul prompt
    promptTemplate: v.string(),    // Template dengan {{var}} placeholders
    tags: v.array(v.string()),     // Array tag string
    icon: v.string(),              // [v2 NEW] Icon key sama dengan folder icons
  })
    .index('by_user', ['userId'])
    .index('by_folder', ['folderId']),

  /**
   * Notes — Catatan Markdown per folder
   */
  notes: defineTable({
    folderId: v.id('folders'),     // Parent folder
    userId: v.string(),            // Clerk userId
    title: v.string(),             // Judul note
    content: v.optional(v.string()), // Konten Markdown
  })
    .index('by_folder', ['folderId'])
    .index('by_user', ['userId']),

  /**
   * Users — Data user dari Clerk
   */
  users: defineTable({
    clerkId: v.string(),           // Clerk user ID
    email: v.string(),             // Email user
    name: v.optional(v.string()),  // [v2 NEW] Full name dari sign up form
    expoPushToken: v.optional(v.string()), // Untuk push notif
  }).index('by_clerk', ['clerkId']),
});
