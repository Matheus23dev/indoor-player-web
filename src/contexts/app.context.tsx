import React, { createContext, useContext, useState } from 'react';
import Swal, { type SweetAlertOptions, type SweetAlertResult } from 'sweetalert2';
import { HelmetProvider } from 'react-helmet-async'
import { toast, Toaster } from 'sonner';
import { Colors } from '../constants';
import Overlay from '../components/feedback/Overlay';

import useStorage from '../hooks/useStorage';

type ToastType = 'success' | 'info' | 'error' | 'warn';

interface AppContextValue {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
  showToast: (text: string, type: ToastType) => void;
  SAlert: (config: SweetAlertOptions) => Promise<SweetAlertResult>;
  handleOverlay: (message: string, isLoading: boolean) => void;
  user: any;
  setUser: (user: any) => void;
 
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [overlay, setOverlay] = useState({ message: '', isLoading: false });
  const [user, setUser] = useStorage<any | null>("@USER", null);
 
  const toastColors: Record<ToastType, string> = {
    success: Colors.verde,
    info: Colors.azulSecundario,
    error: Colors.vermelho,
    warn: Colors.amarelo
  };

  const notifySuccess = (message: string) => toast.success(message, { duration: 4000 });
  const notifyError = (message: string) => toast.error(message);

  const showToast = (text: string, type: ToastType) => {
    const color = toastColors[type];
    toast.custom((t: any) => (
      <div
        className={`relative p-4 shadow-md rounded-lg text-white w-full pr-10 ${t.visible ? 'animate-fade-in' : 'animate-fade-out'}`}
        style={{ backgroundColor: color }}
      >
        <span className="text-sm text-white">{text}</span>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="absolute top-1 right-4 text-2xl text-white font-bold"
        >
          &times;
        </button>
      </div>
    ));
  };

  const SAlert = (config: SweetAlertOptions): Promise<SweetAlertResult> => {
    return Swal.fire(config);
  };

  const handleOverlay = (message: string, isLoading: boolean) => {
    setOverlay({ message, isLoading });
  };

  return (
    <AppContext.Provider
      value={{
        notifySuccess,
        notifyError,
        showToast,
        SAlert,
        handleOverlay,
        user,
        setUser
      }}
    >
      <HelmetProvider>
        <meta charSet="utf-8" />
        <title>Tijuca track</title>
      </HelmetProvider>
      <Toaster richColors position="top-right" />
      <Overlay message={overlay.message || 'Carregando...'} isLoading={overlay.isLoading} />
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
