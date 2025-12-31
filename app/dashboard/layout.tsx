'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import ProfileRegistrationModal from '@/components/auth/ProfileRegistrationModal';
import Header from '@/components/layout/Header';
import TabNavigation from '@/components/layout/TabNavigation';
import { usersApi } from '@/lib/api/users.api';
import { useTeamId } from '@/lib/hooks/useTeamId';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { teamId } = useTeamId();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!authLoading && isAuthenticated) {
        try {
          // 프로필 정보 확인
          await usersApi.getProfile();
          setShowProfileModal(false);
        } catch (error: any) {
          // 프로필이 없으면 모달 표시
          if (error.response?.status === 404) {
            setShowProfileModal(true);
          }
        } finally {
          setCheckingProfile(false);
        }
      } else if (!authLoading && !isAuthenticated) {
        // 인증되지 않았으면 로그인 페이지로
        // localStorage도 정리
        localStorage.removeItem('token');
        localStorage.removeItem('teamId');
        router.push('/login');
      }
    };

    checkProfile();
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TabNavigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <ProfileRegistrationModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}

