import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@/lib/clerk";

export function useFolders() {
  const { user } = useUser();
  const userId = user?.id ?? '';

  const folders = useQuery(api.folders.listFolders, { userId });
  const archivedFolders = useQuery(api.folders.listArchivedFolders, { userId });
  
  const createFolder = useMutation(api.folders.createFolder);
  const updateFolder = useMutation(api.folders.updateFolder);
  const archiveFolder = useMutation(api.folders.archiveFolder);
  const deleteFolder = useMutation(api.folders.deleteFolder);

  return { 
    folders, 
    archivedFolders, 
    createFolder, 
    updateFolder, 
    archiveFolder, 
    deleteFolder 
  };
}

export function useFolderById(folderId?: Id<'folders'>) {
  return useQuery(api.folders.getFolder, folderId ? { id: folderId } : "skip");
}
