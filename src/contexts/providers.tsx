import { ReactNode } from "react";
import { AppProvider } from "./app.context";
import { AuthProvider } from "./auth.context";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
  
    <AppProvider>
        <AuthProvider>
      {children}
       </AuthProvider>
    </AppProvider>
   
  );
};

