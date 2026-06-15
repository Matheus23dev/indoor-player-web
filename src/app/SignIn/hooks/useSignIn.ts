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
  const { notifyError, showToast, handleOverlay } = useApp();
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
      const token = await signInRequest(email, password);
      await login(token, navigate);
    } catch (error) {
      notifyError("Erro ao fazer login. Verifique suas credenciais.");
      buttonRef.current?.reset(Colors.amarelo);
    } finally {
      setLoading(false);
      handleOverlay("", false);
    }
  };

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
