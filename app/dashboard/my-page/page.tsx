'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { teamsApi } from '@/lib/api/teams.api';
import { usersApi } from '@/lib/api/users.api';
import { UserProfile } from '@/lib/types/user.types';
import { UserTeam } from '@/lib/types/team.types';
import { useTeamId } from '@/lib/hooks/useTeamId';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';

export default function MyPagePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { teamId } = useTeamId();
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
    return <Loading size="lg" className="py-12" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">마이페이지</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* 프로필 정보 */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">프로필 정보</h2>
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
            {profile?.summary && (
              <div className="flex flex-col">
                <span className="text-gray-600 mb-1">소개</span>
                <span className="font-medium">{profile.summary}</span>
              </div>
            )}
          </div>
        </div>

        {/* 팀 정보 */}
        {userTeam && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">팀 정보</h2>
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
      </div>

      {/* 계정 설정 */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">계정 설정</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            size="md"
            className="flex-1"
            onClick={() => router.push('/dashboard/profile/edit')}
          >
            프로필 수정
          </Button>
          <Button
            variant="outline"
            size="md"
            className="flex-1"
            onClick={() => router.push('/dashboard/profile/password')}
          >
            비밀번호 변경
          </Button>
        </div>
      </div>

      {/* 기타 */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">기타</h2>
        <Button
          variant="outline"
          size="md"
          className="w-full"
          onClick={handleLogout}
        >
          로그아웃
        </Button>
      </div>
    </div>
  );
}

