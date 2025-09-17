'use client';

import { authAPI, LoginData, RegisterData, User } from '@/lib/api';
import Cookies from 'js-cookie';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const isAuthenticated = !!user;

  // Garantir que está montado no cliente antes de acessar cookies
  useEffect(() => {
    setMounted(true);
  }, []);

  // Verificar se há token salvo e obter dados do usuário
  useEffect(() => {
    if (!mounted) return;
    
    const token = Cookies.get('access_token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [mounted]);

  const loadUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      Cookies.remove('access_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    try {
      const response = await authAPI.login(data);
      const { access_token } = response.data;
      
      // Salvar token no cookie (expira em 30 minutos)
      Cookies.set('access_token', access_token, { 
        expires: 1/48 // 30 minutos em dias
      });
      
      // Carregar dados do usuário
      await loadUser();
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || 'Erro ao fazer login'
      );
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await authAPI.register(data);
      // Após registrar, fazer login automaticamente
      await login({ username: data.username, password: data.password });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || 'Erro ao registrar usuário'
      );
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    toast.info('Você foi desconectado com sucesso');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  // Evitar problemas de hidratação não renderizando até estar montado
  if (!mounted) {
    return (
      <AuthContext.Provider value={{ ...value, loading: true }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
