<<<<<<< HEAD
import { useState, useEffect, useCallback } from "react";
import { getFolders } from "../services/folders.services";

export function useFolders() {
  const [folders, setFolders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFolders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getFolders();
      setFolders(data);
    } catch (error) {
      console.error("Erro ao carregar pastas:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  return {
    folders,
    loadFolders,
    isLoading,
=======
import {
  useCallback,
  useState,
} from "react";

import {
  createFolder,
  deleteFolder,
  getFolders,
  updateFolder,
} from "../services/folders.services";

import type {
  Folder,
  FolderPayload,
} from "../types";

export function useFolders() {
  const [folders, setFolders] =
    useState<Folder[]>([]);

  const [loadingFolders, setLoadingFolders] =
    useState(false);

  const [savingFolder, setSavingFolder] =
    useState(false);

  const [deletingFolderId, setDeletingFolderId] =
    useState<string | null>(
      null,
    );

  const loadFolders =
    useCallback(async () => {
      try {
        setLoadingFolders(true);

        const data =
          await getFolders();

        setFolders(data);

        return data;
      } finally {
        setLoadingFolders(false);
      }
    }, []);

  const addFolder =
    useCallback(
      async (
        data: FolderPayload,
      ) => {
        try {
          setSavingFolder(true);

          const folder =
            await createFolder(
              data,
            );

          setFolders(
            (currentFolders) => [
              folder,
              ...currentFolders,
            ],
          );

          return folder;
        } finally {
          setSavingFolder(false);
        }
      },
      [],
    );

  const editFolder =
    useCallback(
      async (
        id: string,
        data: FolderPayload,
      ) => {
        try {
          setSavingFolder(true);

          const folder =
            await updateFolder(
              id,
              data,
            );

          setFolders(
            (currentFolders) =>
              currentFolders.map(
                (currentFolder) =>
                  currentFolder.id ===
                  id
                    ? folder
                    : currentFolder,
              ),
          );

          return folder;
        } finally {
          setSavingFolder(false);
        }
      },
      [],
    );

  const removeFolder =
    useCallback(
      async (
        id: string,
      ) => {
        try {
          setDeletingFolderId(
            id,
          );

          const response =
            await deleteFolder(
              id,
            );

          setFolders(
            (currentFolders) =>
              currentFolders.filter(
                (folder) =>
                  folder.id !== id,
              ),
          );

          return response;
        } finally {
          setDeletingFolderId(
            null,
          );
        }
      },
      [],
    );

  return {
    folders,
    setFolders,

    loadingFolders,
    savingFolder,
    deletingFolderId,

    loadFolders,
    addFolder,
    editFolder,
    removeFolder,
>>>>>>> feature/playlist
  };
}