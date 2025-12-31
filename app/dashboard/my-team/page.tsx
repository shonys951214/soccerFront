'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTeamId } from '@/lib/hooks/useTeamId';
import { teamsApi } from '@/lib/api/teams.api';
import { TeamDetail, UserTeam } from '@/lib/types/team.types';
import Loading from '@/components/common/Loading';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';

export default function MyTeamPage() {
  const router = useRouter();
  const { teamId, isLoading: teamIdLoading } = useTeamId();
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [userTeam, setUserTeam] = useState<UserTeam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leaveConfirmText, setLeaveConfirmText] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [leaveErrorMessage, setLeaveErrorMessage] = useState('');
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [uploadErrorMessage, setUploadErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!teamId) return;

      setIsLoading(true);
      try {
        const [teamData, userTeamData] = await Promise.all([
          teamsApi.getTeam(teamId),
          teamsApi.getMyTeam(),
        ]);
        setTeam(teamData);
        setUserTeam(userTeamData);
      } catch (err: any) {
        setError('팀 정보를 불러오는데 실패했습니다.');
        console.error('Failed to fetch team:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (teamId) {
      fetchData();
    }
  }, [teamId]);

  const handleLeaveTeam = () => {
    setShowLeaveModal(true);
    setLeaveConfirmText('');
    setLeaveErrorMessage('');
  };

  const handleConfirmLeave = async () => {
    if (!teamId) return;
    
    if (leaveConfirmText.trim() !== '탈퇴') {
      setLeaveErrorMessage('"탈퇴"를 정확히 입력해주세요.');
      return;
    }
    
    setIsLeaving(true);
    try {
      await teamsApi.leaveTeam(teamId);
      localStorage.removeItem('teamId');
      setShowLeaveModal(false);
      router.push('/team-select');
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : '팀 탈퇴에 실패했습니다.';
      setLeaveErrorMessage(errorMsg || '팀 탈퇴에 실패했습니다.');
    } finally {
      setIsLeaving(false);
    }
  };

  const handleDeleteTeam = () => {
    setShowDeleteModal(true);
    setDeleteConfirmText('');
    setDeleteErrorMessage('');
  };

  const handleConfirmDelete = async () => {
    if (!teamId) return;
    
    if (deleteConfirmText.trim() !== '삭제') {
      setDeleteErrorMessage('"삭제"를 정확히 입력해주세요.');
      return;
    }
    
    setIsDeleting(true);
    try {
      await teamsApi.deleteTeam(teamId);
      localStorage.removeItem('teamId');
      setShowDeleteModal(false);
      router.push('/team-select');
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : '팀 삭제에 실패했습니다.';
      setDeleteErrorMessage(errorMsg || '팀 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !teamId) return;

    // 이미지 파일 검증
    if (!file.type.startsWith('image/')) {
      setUploadErrorMessage('이미지 파일만 업로드 가능합니다.');
      setTimeout(() => setUploadErrorMessage(''), 3000);
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      setUploadErrorMessage('파일 크기는 5MB 이하여야 합니다.');
      setTimeout(() => setUploadErrorMessage(''), 3000);
      return;
    }

    setIsUploadingLogo(true);
    try {
      await teamsApi.uploadTeamLogo(teamId, file);
      // 팀 정보 새로고침
      const updatedTeam = await teamsApi.getTeam(teamId);
      setTeam(updatedTeam);
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : '팀 로고 업로드에 실패했습니다.';
      setUploadErrorMessage(errorMsg || '팀 로고 업로드에 실패했습니다.');
      setTimeout(() => setUploadErrorMessage(''), 3000);
    } finally {
      setIsUploadingLogo(false);
      // input 초기화
      e.target.value = '';
    }
  };

  if (teamIdLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  if (!teamId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">팀에 가입되어 있지 않습니다.</p>
            <a
              href="/team-select"
              className="text-red-600 hover:text-red-700 underline"
            >
              클럽 생성 또는 가입하기
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return null;
  }

  // createdAt에서 년도와 월만 추출
  const formatCreatedDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">우리 팀 소개</h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 팀 로고/사진 */}
        <div className="relative w-full h-48 sm:h-64 bg-gray-200 flex items-center justify-center">
          {team.logo ? (
            <img
              src={team.logo}
              alt={team.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-4xl sm:text-6xl">⚽</div>
          )}
          {isUploadingLogo && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
          {/* 팀장만 로고 변경 버튼 표시 */}
          {userTeam && userTeam.role === 'captain' && (
            <div className="absolute bottom-4 right-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={isUploadingLogo}
                  className="hidden"
                  id="team-logo-input"
                />
                <Button
                  variant="primary"
                  size="sm"
                  disabled={isUploadingLogo}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    document.getElementById('team-logo-input')?.click();
                  }}
                >
                  {isUploadingLogo ? '업로드 중...' : '로고 변경'}
                </Button>
              </label>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {/* 팀명 */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{team.name}</h2>
          </div>

          {/* 지역 정보 */}
          {team.region && (
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">지역</h3>
              <p className="text-base sm:text-lg text-gray-900">{team.region}</p>
            </div>
          )}

          {/* 팀 설명 */}
          {team.description && (
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">팀 소개</h3>
              <p className="text-sm sm:text-base text-gray-900 whitespace-pre-wrap break-words">{team.description}</p>
            </div>
          )}

          {/* 팀장 정보 */}
          {team.captain && (
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">팀장</h3>
              <p className="text-base sm:text-lg text-gray-900">{team.captain.name}</p>
            </div>
          )}

          {/* 팀 시작일 */}
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">팀 시작일</h3>
            <p className="text-base sm:text-lg text-gray-900">{formatCreatedDate(team.createdAt)}</p>
          </div>

          {/* 팀 관리 버튼 */}
          {userTeam && (
            <div className="pt-4 border-t border-gray-200">
              {userTeam.role === 'captain' ? (
                <Button
                  variant="danger"
                  size="md"
                  className="w-full"
                  onClick={handleDeleteTeam}
                  isLoading={isDeleting}
                >
                  팀 삭제
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="md"
                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                  onClick={handleLeaveTeam}
                  isLoading={isLeaving}
                >
                  팀 탈퇴
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 에러 메시지 */}
      {uploadErrorMessage && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {uploadErrorMessage}
        </div>
      )}

      {/* 팀 탈퇴 확인 모달 */}
      <Modal
        isOpen={showLeaveModal}
        onClose={() => {
          setShowLeaveModal(false);
          setLeaveConfirmText('');
          setLeaveErrorMessage('');
        }}
        title="팀 탈퇴 확인"
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowLeaveModal(false);
                setLeaveConfirmText('');
                setLeaveErrorMessage('');
              }}
              disabled={isLeaving}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmLeave}
              isLoading={isLeaving}
              disabled={leaveConfirmText.trim() !== '탈퇴'}
              className="flex-1"
            >
              탈퇴하기
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-semibold mb-2">⚠️ 경고</p>
            <p className="text-sm text-red-700">
              팀을 탈퇴하면 모든 팀 데이터에 대한 접근 권한이 제거됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700 mb-2">
              정말로 팀을 탈퇴하시겠습니까? 확인을 위해 <strong className="text-red-600">"탈퇴"</strong>를 입력해주세요.
            </p>
            <Input
              type="text"
              placeholder="탈퇴"
              value={leaveConfirmText}
              onChange={(e) => {
                setLeaveConfirmText(e.target.value);
                setLeaveErrorMessage('');
              }}
              className="w-full"
            />
          </div>
          {leaveErrorMessage && (
            <div className="text-red-600 text-sm">{leaveErrorMessage}</div>
          )}
        </div>
      </Modal>

      {/* 팀 삭제 확인 모달 */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmText('');
          setDeleteErrorMessage('');
        }}
        title="팀 삭제 확인"
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmText('');
                setDeleteErrorMessage('');
              }}
              disabled={isDeleting}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
              disabled={deleteConfirmText.trim() !== '삭제'}
              className="flex-1"
            >
              삭제하기
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-semibold mb-2">⚠️ 경고</p>
            <p className="text-sm text-red-700">
              팀을 삭제하면 모든 팀 데이터(경기 기록, 통계, 팀원 정보 등)가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700 mb-2">
              정말로 팀을 삭제하시겠습니까? 확인을 위해 <strong className="text-red-600">"삭제"</strong>를 입력해주세요.
            </p>
            <Input
              type="text"
              placeholder="삭제"
              value={deleteConfirmText}
              onChange={(e) => {
                setDeleteConfirmText(e.target.value);
                setDeleteErrorMessage('');
              }}
              className="w-full"
            />
          </div>
          {deleteErrorMessage && (
            <div className="text-red-600 text-sm">{deleteErrorMessage}</div>
          )}
        </div>
      </Modal>
    </div>
  );
}

