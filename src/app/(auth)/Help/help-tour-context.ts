import { createContext } from "react";

export interface HelpTourContextValue {
  startTour: () => void;
  isTourActive: boolean;
  activeStepId: string | null;
}

export const HelpTourContext = createContext<HelpTourContextValue | null>(null);
