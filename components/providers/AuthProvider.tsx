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
    } catch (error: any) {
      // 프로필이 없는 경우 (404)는 user 정보를 유지 (회원가입 직후 프로필 설정 페이지로 가야 함)
      if (error.response?.status === 404) {
        // 프로필이 없어도 사용자는 인증된 상태이므로 user 정보는 유지
        // 단, 이미 user가 없으면 null 유지
        return;
      }
      // 다른 에러인 경우에만 user를 null로 설정
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

