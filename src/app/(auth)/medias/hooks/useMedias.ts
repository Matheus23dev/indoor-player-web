import {
  useEffect,
  useState,
} from "react";

import {
  getMedias,
} from "../services/medias.services";

export function useMedias() {
  const [medias, setMedias] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadMedias() {
    try {
      const data =
        await getMedias();

      setMedias(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedias();
  }, []);

  return {
    medias,
    loading,
    loadMedias,
  };
}