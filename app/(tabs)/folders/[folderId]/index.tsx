import { Redirect, useLocalSearchParams } from 'expo-router';
import { Id } from '@/convex/_generated/dataModel';

export default function FolderWorkspaceIndex() {
  const { folderId } = useLocalSearchParams<{ folderId: Id<'folders'> }>();
  return <Redirect href={`/folders/${folderId}/tasks`} />;
}
