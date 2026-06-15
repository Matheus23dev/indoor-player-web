import instance from "../../../services/axios";

export const signInRequest = async (email: string, password: string): Promise<string> => {
  const { data } = await instance.post("/auth/login", { email, password });

  if (!data?.access_token) {
    throw new Error("Token de acesso não recebido.");
  }

  return data.access_token;
};
    