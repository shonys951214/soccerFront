'use client';

import { useEffect, useState } from 'react';
import { matchesApi } from '@/lib/api/matches.api';
import { MatchDetail as MatchDetailType } from '@/lib/types/match.types';
import GameExpandable from './GameExpandable';
import AttendanceVote from './AttendanceVote';
import AttendanceStatus from './AttendanceStatus';
import Loading from '@/components/common/Loading';
import Button from '@/components/common/Button';
import Link from 'next/link';

interface MatchDetailProps {
  matchId: string;
  teamId: string;
  canEdit?: boolean;
}

export default function MatchDetail({
  matchId,
  teamId,
  canEdit = false,
}: MatchDetailProps) {
  const [match, setMatch] = useState<MatchDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMatch = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await matchesApi.getMatch(matchId);
      setMatch(data);
    } catch (err: any) {
      setError('경기 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatch();
  }, [matchId]);

  const handleVoteSuccess = () => {
    fetchMatch();
  };

  if (isLoading) {
    return <Loading size="lg" className="py-12" />;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

  if (!match) {
    return <div className="text-gray-500 text-center py-8">경기 정보가 없습니다.</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} (${weekdays[date.getDay()]})`;
  };

  const getCurrentUserAttendance = () => {
    // TODO: 현재 사용자 ID 가져오기
    // 임시로 첫 번째 참석 정보 반환
    return match.attendances?.[0]?.status;
  };

  return (
    <div className="space-y-6">
      {/* 경기 요약 정보 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">경기 정보</h2>
          {canEdit && (
            <div className="flex gap-2">
              <Link href={`/dashboard/matches/${matchId}/record`}>
                <Button variant="primary" size="sm">
                  기록 입력
                </Button>
              </Link>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">날짜</p>
            <p className="text-base font-medium text-gray-900">{formatDate(match.date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">상대팀</p>
            <p className="text-base font-medium text-gray-900">{match.opponentTeamName}</p>
          </div>
          {match.time && (
            <div>
              <p className="text-sm text-gray-600">시간</p>
              <p className="text-base font-medium text-gray-900">{match.time}</p>
            </div>
          )}
          {match.location && (
            <div>
              <p className="text-sm text-gray-600">장소</p>
              <p className="text-base font-medium text-gray-900">{match.location}</p>
            </div>
          )}
          {match.totalOurScore !== undefined && match.totalOpponentScore !== undefined && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">총 점수</p>
              <p className="text-2xl font-bold text-gray-900">
                {match.totalOurScore} - {match.totalOpponentScore}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 참석 투표 */}
      {match.status === 'scheduled' && (
        <AttendanceVote
          matchId={matchId}
          currentStatus={getCurrentUserAttendance()}
          onVoteSuccess={handleVoteSuccess}
        />
      )}

      {/* 참석 현황 */}
      {match.attendances && match.attendances.length > 0 && (
        <AttendanceStatus attendances={match.attendances} />
      )}

      {/* 게임별 상세 */}
      {match.games && match.games.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">게임별 상세</h3>
          <div className="space-y-3">
            {match.games.map((game) => (
              <GameExpandable key={game.id} game={game} />
            ))}
            {/* Total */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  {match.games.reduce((sum, g) => sum + g.ourScore, 0)} -{' '}
                  {match.games.reduce((sum, g) => sum + g.opponentScore, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

