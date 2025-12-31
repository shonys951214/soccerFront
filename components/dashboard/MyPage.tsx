'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { teamsApi } from '@/lib/api/teams.api';
import { usersApi } from '@/lib/api/users.api';
import { UserProfile } from '@/lib/types/user.types';
import { UserTeam } from '@/lib/types/team.types';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import Modal from '@/components/common/Modal';

interface MyPageProps {
  teamId: string;
}

export default function MyPage({ teamId }: MyPageProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userTeam, setUserTeam] = useState<UserTeam | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, teamData] = await Promise.all([
          usersApi.getProfile(),
          teamsApi.getMyTeam(),
        ]);
        setProfile(profileData);
        setUserTeam(teamData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (teamId) {
      fetchData();
    }
  }, [teamId]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (isLoading) {
    return <Loading size="md" />;
  }

  const isCaptain = userTeam?.role === 'captain';

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">마이페이지</h2>

      {/* 프로필 정보 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">프로필 정보</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">이름</span>
            <span className="font-medium">{profile?.name || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">이메일</span>
            <span className="font-medium">{profile?.email || '-'}</span>
          </div>
          {profile?.phone && (
            <div className="flex justify-between">
              <span className="text-gray-600">연락처</span>
              <span className="font-medium">{profile.phone}</span>
            </div>
          )}
          {profile?.birthdate && (
            <div className="flex justify-between">
              <span className="text-gray-600">생년월일</span>
              <span className="font-medium">
                {new Date(profile.birthdate).toLocaleDateString('ko-KR')}
              </span>
            </div>
          )}
          {profile?.positions && profile.positions.length > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">포지션</span>
              <span className="font-medium">{profile.positions.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* 팀 정보 */}
      {userTeam && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800">팀 정보</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">팀명</span>
              <span className="font-medium">{userTeam.teamName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">역할</span>
              <span className="font-medium">
                {userTeam.role === 'captain' ? '팀장' : userTeam.role === 'vice_captain' ? '부팀장' : '팀원'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">상태</span>
              <span className="font-medium">
                {userTeam.status === 'active' ? '활동' : 
                 userTeam.status === 'injured' ? '부상' :
                 userTeam.status === 'long_term_absence' ? '장기 출전 불가' : '단기 출전 불가'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 계정 설정 */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800">계정 설정</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-gray-600"
            onClick={() => router.push('/dashboard/profile/edit')}
          >
            프로필 수정
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-gray-600"
            onClick={() => router.push('/dashboard/profile/password')}
          >
            비밀번호 변경
          </Button>
        </div>
      </div>

      {/* 기타 */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800">기타</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-gray-600"
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        </div>
      </div>
    </div>
  );
}

