import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const baseURL = import.meta.env.VITE_BASE_URL_API;

const instance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use((req) => {
  const token = Cookies.get("@TOKEN");

  if (!token && !req.url?.endsWith('/auth/login')) {
    Swal.fire({
      icon: 'error',
      title: 'Sua sessão expirou! Faça login novamente.',
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      timer: 2500,
    });

    return Promise.reject('Sessão expirada');
  }

  if (token && req.headers) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
}, (error) => Promise.reject(error));

export default instance;