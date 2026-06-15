import React from 'react';

interface OverlayProps {
  message: string;
  isLoading: boolean;
}

const Overlay: React.FC<OverlayProps> = ({ message, isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999999]">
      <div className="bg-white p-6  flex items-center space-x-4">
        <div className="animate-spin rounded-3xl border-t-4 border-b-4 border-ivendeOrange300 w-12 h-12"></div>
        <span className="text-lg text-gray-700">{message}</span>
      </div>
    </div>
  );
};

export default Overlay;
  