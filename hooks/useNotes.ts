import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

/**
 * Hook for listing notes within a specific folder.
 * Used in Folder Workspace → Notes tab.
 */
export function useNotes(folderId: Id<'folders'>) {
  const notes = useQuery(api.notes.listNotes, { folderId });
  const createNote = useMutation(api.notes.createNote);
  const deleteNote = useMutation(api.notes.deleteNote);
  return { notes, createNote, deleteNote };
}

/**
 * Hook for a single note (Note Editor screen).
 * Provides real-time note data and an updateNote mutation
 * for auto-save (debounced title/content patches).
 */
export function useNote(noteId: Id<'notes'>) {
  const note = useQuery(api.notes.getNote, { id: noteId });
  const updateNote = useMutation(api.notes.updateNote);
  return { note, updateNote };
}
