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
  };
}