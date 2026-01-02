'use client';

import { useState, useEffect } from 'react';
import { teamsApi } from '@/lib/api/teams.api';
import { TeamDetail } from '@/lib/types/team.types';
import { formatCreatedDate } from '@/lib/utils/format';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import { getErrorMessage } from '@/lib/utils/error';

interface TeamInfoModalProps {
  teamId: string;
  onClose: () => void;
}

export default function TeamInfoModal({ teamId, onClose }: TeamInfoModalProps) {
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      setIsLoading(true);
      setError('');
      try {
        const teamData = await teamsApi.getTeam(teamId);
        setTeam(teamData);
      } catch (err) {
        setError(getErrorMessage(err, '팀 정보를 불러오는데 실패했습니다.'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, [teamId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center">
            <Loading size="lg" />
          </div>
        ) : error ? (
          <div className="p-8">
            <div className="text-red-600 text-center">{error}</div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={onClose}>
                닫기
              </Button>
            </div>
          </div>
        ) : team ? (
          <>
            {/* 헤더 */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">팀 정보</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* 내용 */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* 팀 로고 */}
              {team.logo && (
                <div className="flex justify-center">
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-gray-200"
                  />
                </div>
              )}

              {/* 팀명 */}
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">팀명</h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{team.name}</p>
              </div>

              {/* 지역 정보 */}
              {team.region && (
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">지역</h3>
                  <p className="text-base sm:text-lg text-gray-900">{team.region}</p>
                </div>
              )}

              {/* 팀 소개 */}
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">팀 소개</h3>
                <p className="text-sm sm:text-base text-gray-900 whitespace-pre-wrap break-words">
                  {team.description || '팀 소개글이 없습니다.'}
                </p>
              </div>

              {/* 팀장 정보 */}
              {team.captain && (
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">팀장</h3>
                  <p className="text-base sm:text-lg text-gray-900">{team.captain.name}</p>
                </div>
              )}

              {/* 생성일 */}
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">생성일</h3>
                <p className="text-base sm:text-lg text-gray-900">{formatCreatedDate(team.createdAt)}</p>
              </div>
            </div>

            {/* 푸터 */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 flex justify-end">
              <Button variant="primary" onClick={onClose}>
                닫기
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

