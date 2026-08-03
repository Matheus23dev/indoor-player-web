import instance from "../../../services/axios";

export const signInRequest = async (email: string, password: string): Promise<string> => {
  const { data } = await instance.post("/auth/login", { email, password });

  if (!data?.token) {
    throw new Error("Token de acesso não recebido.");
  }

  return data.token;
};
