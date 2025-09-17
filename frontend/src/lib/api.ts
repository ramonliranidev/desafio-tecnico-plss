import { IndicadoresResponse, LoginData, LoginResponse, RegisterData, TeamDetails, TeamMatchesResponse, TeamsListResponse, User } from '@/models/api.models';
import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';


// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

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
      toast.error('Sessão expirada. Redirecionando para o login...');
      Cookies.remove('access_token');
      window.location.href = '/login';
    } else if (error.response?.status >= 500) {
      // Erros do servidor
      toast.error('Erro interno do servidor. Tente novamente.');
    } else if (error.response?.status === 404) {
      // Recurso não encontrado
      toast.error('Recurso não encontrado');
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      // Erro de rede
      toast.error('Erro de conexão. Verifique sua internet.');
    }
    return Promise.reject(error);
  }
);

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

// API de Teams
export const teamsAPI = {
  // Buscar times do Brasileirão
  getBrasileirao: async (): Promise<AxiosResponse<TeamsListResponse>> => {
    return api.get('/teams/brasileirao');
  },

  // Buscar detalhes de um time
  getTeamDetails: async (teamId: number): Promise<AxiosResponse<TeamDetails>> => {
    return api.get(`/teams/${teamId}`);
  },

  // Buscar partidas de um time
  getTeamMatches: async (teamId: number): Promise<AxiosResponse<TeamMatchesResponse>> => {
    return api.get(`/teams/${teamId}/matches`);
  },
};

// API de Sistema/Indicadores
export const sistemaAPI = {
  // Buscar indicadores e estatísticas
  getIndicadores: async (): Promise<AxiosResponse<IndicadoresResponse>> => {
    return api.get('/indicadores');
  },

  // Importar dados frescos
  importarDados: async (): Promise<AxiosResponse<any>> => {
    return api.post('/importar');
  },
};

export default api;
