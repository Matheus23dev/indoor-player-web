import {
  useEffect,
  useState,
} from "react";

import {
  getPlaylists,
} from "../services/Playlists.services";

export function usePlaylists() {
  const [playlists, setPlaylists] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  async function loadPlaylists() {
    try {
      const data =
        await getPlaylists();

      setPlaylists(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlaylists();
  }, []);

  return {
    playlists,
    loading,
    loadPlaylists,
  };
}