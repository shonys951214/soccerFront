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
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleLeaveTeam = async () => {
    if (!userTeam) return;
    
    setIsLeaving(true);
    try {
      await teamsApi.leaveTeam(userTeam.teamId);
      localStorage.removeItem('teamId');
      router.push('/team-select');
    } catch (error: any) {
      alert(error.response?.data?.message || '팀 탈퇴에 실패했습니다.');
    } finally {
      setIsLeaving(false);
      setShowLeaveModal(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!userTeam) return;
    
    setIsDeleting(true);
    try {
      await teamsApi.deleteTeam(userTeam.teamId);
      localStorage.removeItem('teamId');
      router.push('/team-select');
    } catch (error: any) {
      alert(error.response?.data?.message || '팀 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
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
          {userTeam && !isCaptain && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-red-600 hover:text-red-700 hover:border-red-500"
              onClick={() => setShowLeaveModal(true)}
            >
              팀 탈퇴
            </Button>
          )}
          {userTeam && isCaptain && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-red-600 hover:text-red-700 hover:border-red-500"
              onClick={() => setShowDeleteModal(true)}
            >
              팀 삭제
            </Button>
          )}
        </div>
      </div>

      {/* 팀 탈퇴 확인 모달 */}
      <Modal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title="팀 탈퇴 확인"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            정말로 팀에서 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLeaveModal(false)}
            >
              취소
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleLeaveTeam}
              isLoading={isLeaving}
            >
              탈퇴하기
            </Button>
          </div>
        </div>
      </Modal>

      {/* 팀 삭제 확인 모달 */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="팀 삭제 확인"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            정말로 팀을 삭제하시겠습니까? 팀의 모든 데이터가 삭제되며 이 작업은 되돌릴 수 없습니다.
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(false)}
            >
              취소
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteTeam}
              isLoading={isDeleting}
            >
              삭제하기
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

