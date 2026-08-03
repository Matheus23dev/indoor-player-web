import { useContext } from "react";
import { AppContext } from "./app-context";

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp deve ser usado dentro de um AppProvider");
  }

  return context;
}
