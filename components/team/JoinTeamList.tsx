'use client';

import { useState, useEffect, useMemo } from 'react';
import { teamsApi } from '@/lib/api/teams.api';
import { Team } from '@/lib/types/team.types';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import TeamInfoModal from './TeamInfoModal';

interface JoinTeamListProps {
  onJoin: (teamId: string) => Promise<void>;
  isLoading?: boolean;
  onJoinSuccess?: () => void;
}

export default function JoinTeamList({ onJoin, isLoading = false, onJoinSuccess }: JoinTeamListProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await teamsApi.getPublicTeams();
        setTeams(data);
      } catch (err: unknown) {
        setError('팀 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // 검색 필터링 로직
  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) {
      return teams;
    }

    const query = searchQuery.trim().toLowerCase();
    return teams.filter((team) => {
      // 팀명으로 검색
      const nameMatch = team.name.toLowerCase().includes(query);
      
      // 지역으로 검색
      const regionMatch = team.region?.toLowerCase().includes(query) || false;
      
      // 팀 소개글로 검색
      const descriptionMatch = team.description?.toLowerCase().includes(query) || false;

      // 하나라도 매치되면 표시
      return nameMatch || regionMatch || descriptionMatch;
    });
  }, [teams, searchQuery]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  return (
    <>
      {/* 검색 입력 필드 */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="팀명, 지역, 소개글로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            검색 결과: <span className="font-semibold">{filteredTeams.length}개</span> 팀
          </p>
        )}
      </div>

      {/* 팀 목록 */}
      {filteredTeams.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          {searchQuery ? '검색 결과가 없습니다.' : '등록된 팀이 없습니다.'}
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-red-500 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div className="min-w-0 flex-1 flex items-center gap-3">
                  {/* 팀 로고 */}
                  {team.logo && (
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{team.name}</h3>
                    {team.region && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">{team.region}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTeamId(team.id)}
                    className="w-full sm:w-auto"
                  >
                    팀정보
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onJoin(team.id)}
                    isLoading={isLoading}
                    className="w-full sm:w-auto"
                  >
                    가입신청
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 팀 정보 모달 */}
      {selectedTeamId && (
        <TeamInfoModal
          teamId={selectedTeamId}
          onClose={() => setSelectedTeamId(null)}
        />
      )}
    </>
  );
}

