import {
  useCallback,
  useState,
} from "react";

import {
  deleteMedia,
  getMedias,
  uploadMedia,
} from "../services/medias.services";

import type {
  Media,
} from "../types";

export function useMedias() {
  const [medias, setMedias] =
    useState<Media[]>([]);

  const [loadingMedias, setLoadingMedias] =
    useState(false);

  const [uploadingMedia, setUploadingMedia] =
    useState(false);

  const [deletingMediaId, setDeletingMediaId] =
    useState<string | null>(
      null,
    );

  const loadMedias =
    useCallback(async () => {
      try {
        setLoadingMedias(true);

        const data =
          await getMedias();

        setMedias(data);

        return data;
      } finally {
        setLoadingMedias(false);
      }
    }, []);

  const sendMedia =
    useCallback(
      async (
        file: File,
        folderId?: string | null,
      ) => {
        try {
          setUploadingMedia(true);

          const media =
            await uploadMedia(
              file,
              folderId,
            );

          setMedias(
            (currentMedias) => [
              media,
              ...currentMedias,
            ],
          );

          return media;
        } finally {
          setUploadingMedia(false);
        }
      },
      [],
    );

  const removeMedia =
    useCallback(
      async (
        id: string,
      ) => {
        try {
          setDeletingMediaId(id);

          const response =
            await deleteMedia(id);

          setMedias(
            (currentMedias) =>
              currentMedias.filter(
                (media) =>
                  media.id !== id,
              ),
          );

          return response;
        } finally {
          setDeletingMediaId(
            null,
          );
        }
      },
      [],
    );

  return {
    medias,
    setMedias,

    loadingMedias,
    uploadingMedia,
    deletingMediaId,

    loadMedias,
    sendMedia,
    removeMedia,
  };
}