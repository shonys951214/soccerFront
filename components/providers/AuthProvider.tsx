'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authApi } from '@/lib/api/auth.api';
import { usersApi } from '@/lib/api/users.api';
import { User } from '@/lib/types/auth.types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const profile = await usersApi.getProfile();
      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        profileImage: profile.profileImage,
        provider: 'email', // TODO: 실제 provider 정보 가져오기
      });
    } catch (error) {
      // 프로필이 없거나 에러 발생 시 user를 null로 설정
      setUser(null);
    }
  };

  useEffect(() => {
    // 토큰이 있으면 사용자 정보 확인
    const token = localStorage.getItem('token');
    if (token) {
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // 이전 사용자의 데이터 정리
    localStorage.removeItem('teamId');
    const response = await authApi.login({ email, password });
    setUser(response.user);
    // 프로필 정보도 새로고침
    await refreshUser();
  };

  const signup = async (email: string, password: string, name: string) => {
    // 이전 사용자의 데이터 정리
    localStorage.removeItem('teamId');
    const response = await authApi.signup({ email, password, name });
    setUser(response.user);
    // 프로필 정보도 새로고침
    await refreshUser();
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    // localStorage 정리
    localStorage.removeItem('token');
    localStorage.removeItem('teamId');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

