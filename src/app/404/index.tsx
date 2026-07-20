import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-(--azul-primario) text-center">
      <h1 className="text-3xl font-bold text-white mb-4 sm:text-4xl">404 - Página Não Encontrada</h1>
      <p className="mb-8 text-red-500 font-bold sm:text-2xl">Ops! A página que você tentou acessar não existe.</p>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-green-600 transition"
      >
        Voltar à página anterior
      </button>
    </div>
  );
};

export default ErrorPage;
