import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      Cookies.remove('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tipos para as requisições
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// Funções da API
export const authAPI = {
  // Registro de usuário
  register: async (data: RegisterData): Promise<AxiosResponse<User>> => {
    return api.post('/users/signup', data);
  },

  // Login
  login: async (data: LoginData): Promise<AxiosResponse<LoginResponse>> => {
    return api.post('/users/login', data);
  },

  // Obter dados do usuário logado
  getMe: async (): Promise<AxiosResponse<User>> => {
    return api.get('/users/me');
  },

  // Logout (remove token)
  logout: () => {
    Cookies.remove('access_token');
  },
};

export default api;
