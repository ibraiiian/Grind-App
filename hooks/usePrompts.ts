import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@/lib/clerk';

export function usePrompts() {
  const { user } = useUser();

  const prompts = useQuery(api.prompts.listPrompts, user?.id ? { userId: user.id } : 'skip');

  const createPrompt = useMutation(api.prompts.createPrompt);
  const updatePrompt = useMutation(api.prompts.updatePrompt);
  const deletePrompt = useMutation(api.prompts.deletePrompt);

  return { prompts, createPrompt, updatePrompt, deletePrompt };
}

export function usePromptsByFolder(folderId: Id<'folders'>) {
  const prompts = useQuery(api.prompts.listPromptsByFolder, { folderId });
  return { prompts };
}

export function useAllPrompts() {
  const { user } = useUser();
  const prompts = useQuery(api.prompts.listPrompts, user?.id ? { userId: user.id } : 'skip');
  const createPrompt = useMutation(api.prompts.createPrompt);
  const updatePrompt = useMutation(api.prompts.updatePrompt);
  const deletePrompt = useMutation(api.prompts.deletePrompt);
  return { prompts, createPrompt, updatePrompt, deletePrompt };
}
