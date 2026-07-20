import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/auth.context";
import { useApp } from "../../../contexts";
import { signInRequest } from "../services/auth.service";
import { Colors } from "../../../constants";
import type { LoaderButtonHandle } from "../../../components/common/LoaderButton";

export const useSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const buttonRef = useRef<LoaderButtonHandle>(null);
  const { notifyError, showToast } = useApp();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email) {
      showToast("O e-mail é obrigatório", "warn");
      buttonRef.current?.reset(Colors.amarelo);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Informe um e-mail válido", "warn");
      buttonRef.current?.reset(Colors.amarelo);
      return;
    }

    if (!password) {
      showToast("A senha é obrigatória", "warn");
      buttonRef.current?.reset(Colors.amarelo);
      return;
    }

    try {
      setLoading(true);
    
      const token = await signInRequest(
        email,
        password,
      );
    
      console.log('TOKEN:', token);
    
      await login(
        token,
        navigate,
      );
    
      console.log('LOGIN OK');
    } catch (error: any) {
      console.log(
        'ERRO:',
        error,
      );
    
      console.log(
        'RESPONSE:',
        error?.response,
      );
    
      console.log(
        'DATA:',
        error?.response?.data,
      );
    
      console.log(
        'STATUS:',
        error?.response?.status,
      );
    
      notifyError(
        "Erro ao fazer login. Verifique suas credenciais."
      );
    
      buttonRef.current?.reset(
        Colors.amarelo,
      );
    }}
  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    buttonRef,
    handleSignIn,
    isAuthenticated,
  };
};
