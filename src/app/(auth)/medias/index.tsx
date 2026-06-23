import {
  useState,
} from "react";

import {
  useMedias,
} from "./hooks/useMedias";

import {
  deleteMedia,
  uploadMedia,
} from "./services/medias.services";

import {
  MediaCard,
} from "./components/mediaCard";

import {
  UploadMediaModal,
} from "./components/uploadMediaModal";

export default function MediasPage() {
  const {
    medias,
    loadMedias,
  } = useMedias();

  const [open,
    setOpen] =
    useState(false);

  async function handleUpload(
    file: File,
  ) {
    await uploadMedia(
      file,
    );

    setOpen(false);

    loadMedias();
  }

  async function handleDelete(
    id: string,
  ) {
    await deleteMedia(id);

    loadMedias();
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Mídias
        </h1>

        <button
          onClick={() =>
            setOpen(true)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Upload
        </button>

      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">

        {medias.map(
          (media: any) => (
            <MediaCard
              key={media.id}
              media={media}
              onDelete={
                handleDelete
              }
            />
          ),
        )}

      </div>

      <UploadMediaModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
        onUpload={
          handleUpload
        }
      />

    </div>
  );
}