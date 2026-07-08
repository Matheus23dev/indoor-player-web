import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Swal from "sweetalert2";

import {
  useFolders,
} from "./useFolders";

import {
  useMedias,
} from "./useMedias";

import type {
  Folder,
  Media,
  MediaType,
} from "../types";

export type MediaFilter =
  | "ALL"
  | MediaType;

export function useMediaLibrary() {
  const {
    medias,
    setMedias,
    loadingMedias,
    loadMedias,
    removeMedia,
  } = useMedias();

  const {
    folders,
    setFolders,
    loadingFolders,
    loadFolders,
    removeFolder,
  } = useFolders();

  const [search, setSearch] =
    useState("");

  const [
    filterType,
    setFilterType,
  ] = useState<MediaFilter>(
    "ALL",
  );

  const [
    selectedFolderId,
    setSelectedFolderId,
  ] = useState<string | null>(
    null,
  );

  const loading =
    loadingMedias ||
    loadingFolders;

  const selectedFolder =
    useMemo(
      () =>
        folders.find(
          (folder) =>
            folder.id ===
            selectedFolderId,
        ) ?? null,
      [
        folders,
        selectedFolderId,
      ],
    );

  const normalizedSearch =
    search
      .trim()
      .toLowerCase();

  const visibleFolders =
    useMemo(() => {
      if (selectedFolderId) {
        return [];
      }

      return folders.filter(
        (folder) =>
          folder.name
            .toLowerCase()
            .includes(
              normalizedSearch,
            ),
      );
    }, [
      folders,
      selectedFolderId,
      normalizedSearch,
    ]);

  const visibleMedias =
    useMemo(() => {
      return medias.filter(
        (media) => {
          const matchesFolder =
            selectedFolderId
              ? media.folderId ===
                selectedFolderId
              : media.folderId == null;

          const matchesSearch =
            media.name
              .toLowerCase()
              .includes(
                normalizedSearch,
              );

          const matchesType =
            filterType ===
              "ALL" ||
            media.type ===
              filterType;

          return (
            matchesFolder &&
            matchesSearch &&
            matchesType
          );
        },
      );
    }, [
      medias,
      selectedFolderId,
      normalizedSearch,
      filterType,
    ]);

  const totalImages =
    useMemo(
      () =>
        medias.filter(
          (media) =>
            media.type ===
            "IMAGE",
        ).length,
      [medias],
    );

  const totalVideos =
    useMemo(
      () =>
        medias.filter(
          (media) =>
            media.type ===
            "VIDEO",
        ).length,
      [medias],
    );

  const loadLibrary =
    useCallback(async () => {
      try {
        await Promise.all([
          loadMedias(),
          loadFolders(),
        ]);
      } catch (error: any) {
        const message =
          error?.response?.data
            ?.message ??
          "Não foi possível carregar a biblioteca.";

        await Swal.fire({
          icon: "error",
          title:
            "Erro ao carregar",
          text:
            Array.isArray(
              message,
            )
              ? message[0]
              : message,
        });
      }
    }, [
      loadFolders,
      loadMedias,
    ]);

  const openFolder =
    useCallback(
      (
        folder: Folder,
      ) => {
        setSelectedFolderId(
          folder.id,
        );

        setSearch("");
        setFilterType("ALL");
      },
      [],
    );

  const goToRoot =
    useCallback(() => {
      setSelectedFolderId(
        null,
      );

      setSearch("");
      setFilterType("ALL");
    }, []);

  const handleDeleteMedia =
    useCallback(
      async (
        media: Media,
      ) => {
        const result =
          await Swal.fire({
            icon: "warning",
            title:
              "Excluir mídia?",
            html: `
              <p>A mídia <strong>${escapeHtml(
                media.name,
              )}</strong> será excluída.</p>

              <p style="margin-top: 8px; font-size: 13px;">
                Ela também será removida das playlists que a utilizam.
              </p>
            `,
            showCancelButton:
              true,
            confirmButtonText:
              "Sim, excluir",
            cancelButtonText:
              "Cancelar",
            confirmButtonColor:
              "#dc2626",
          });

        if (
          !result.isConfirmed
        ) {
          return;
        }

        try {
          const response =
            await removeMedia(
              media.id,
            );

          setFolders(
            (currentFolders) =>
              currentFolders.map(
                (folder) => {
                  if (
                    folder.id !==
                    media.folderId
                  ) {
                    return folder;
                  }

                  return {
                    ...folder,

                    _count: {
                      medias:
                        Math.max(
                          0,
                          (
                            folder
                              ._count
                              ?.medias ??
                            0
                          ) - 1,
                        ),
                    },
                  };
                },
              ),
          );

          await Swal.fire({
            icon: "success",
            title:
              "Mídia excluída",
            text:
              response.message,
          });
        } catch (error: any) {
          const message =
            error?.response?.data
              ?.message ??
            "Não foi possível excluir a mídia.";

          await Swal.fire({
            icon: "error",
            title:
              "Erro ao excluir",
            text:
              Array.isArray(
                message,
              )
                ? message[0]
                : message,
          });
        }
      },
      [
        removeMedia,
        setFolders,
      ],
    );

  const handleDeleteFolder =
    useCallback(
      async (
        folder: Folder,
      ) => {
        const mediasCount =
          folder._count
            ?.medias ?? 0;

        const result =
          await Swal.fire({
            icon: "warning",
            title:
              "Excluir pasta?",
            html: `
              <p>A pasta <strong>${escapeHtml(
                folder.name,
              )}</strong> será excluída.</p>

              <p style="margin-top: 8px; font-size: 13px;">
                ${mediasCount} mídia(s) serão movidas para a raiz.
              </p>
            `,
            showCancelButton:
              true,
            confirmButtonText:
              "Sim, excluir",
            cancelButtonText:
              "Cancelar",
            confirmButtonColor:
              "#dc2626",
          });

        if (
          !result.isConfirmed
        ) {
          return;
        }

        try {
          const response =
            await removeFolder(
              folder.id,
            );

          setMedias(
            (currentMedias) =>
              currentMedias.map(
                (media) => {
                  if (
                    media.folderId !==
                    folder.id
                  ) {
                    return media;
                  }

                  return {
                    ...media,
                    folderId:
                      null,
                    folder:
                      null,
                  };
                },
              ),
          );

          if (
            selectedFolderId ===
            folder.id
          ) {
            setSelectedFolderId(
              null,
            );
          }

          await Swal.fire({
            icon: "success",
            title:
              "Pasta excluída",
            text:
              response.mediasMovedToRoot >
              0
                ? `${response.mediasMovedToRoot} mídia(s) foram movidas para a raiz.`
                : response.message,
          });
        } catch (error: any) {
          const message =
            error?.response?.data
              ?.message ??
            "Não foi possível excluir a pasta.";

          await Swal.fire({
            icon: "error",
            title:
              "Erro ao excluir",
            text:
              Array.isArray(
                message,
              )
                ? message[0]
                : message,
          });
        }
      },
      [
        removeFolder,
        selectedFolderId,
        setMedias,
      ],
    );

  useEffect(() => {
    void loadLibrary();
  }, [loadLibrary]);

  return {
    medias,
    folders,

    loading,

    search,
    setSearch,

    filterType,
    setFilterType,

    selectedFolderId,
    selectedFolder,
    setSelectedFolderId,

    visibleFolders,
    visibleMedias,

    totalImages,
    totalVideos,

    loadLibrary,
    openFolder,
    goToRoot,

    handleDeleteMedia,
    handleDeleteFolder,
  };
}

function escapeHtml(
  value: string,
) {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return value.replace(/[&<>"']/g, (ch) => map[ch]);
}