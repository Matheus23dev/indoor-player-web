import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../lib/environment";

let handlingExpiredSession = false;

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    Accept: "application/json",
  },
});

instance.interceptors.request.use(
  (req) => {
    const token = Cookies.get("@TOKEN");

    if (token && req.headers) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !error.config?.url?.endsWith("/auth/login") &&
      !handlingExpiredSession
    ) {
      handlingExpiredSession = true;
      Cookies.remove("@TOKEN");
      Cookies.remove("user");

      await Swal.fire({
        icon: "warning",
        title: "Sessão expirada",
        text: "Entre novamente para continuar.",
        confirmButtonText: "Ir para o login",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      window.location.assign("/");
    }

    return Promise.reject(error);
  },
);

export default instance;
