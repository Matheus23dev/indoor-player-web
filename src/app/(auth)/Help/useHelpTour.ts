import { useContext } from "react";

import { HelpTourContext } from "./help-tour-context";

export function useHelpTour() {
  const context = useContext(HelpTourContext);

  if (!context) {
    throw new Error("useHelpTour deve ser usado dentro do layout autenticado.");
  }

  return context;
}
