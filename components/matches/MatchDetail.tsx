'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { matchesApi } from '@/lib/api/matches.api';
import { MatchDetail as MatchDetailType, Game } from '@/lib/types/match.types';
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
  const router = useRouter();
  const { user } = useAuth();
  const [match, setMatch] = useState<MatchDetailType | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMatch = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [matchData, gamesData] = await Promise.all([
        matchesApi.getMatch(matchId),
        matchesApi.getMatchGames(matchId).catch(() => []), // 게임 데이터가 없을 수 있음
      ]);
      setMatch(matchData);
      setGames(gamesData);
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

  const handleDelete = async () => {
    if (!confirm('정말로 이 경기를 삭제하시겠습니까?')) return;
    
    try {
      await matchesApi.deleteMatch(matchId);
      // 경기 목록 페이지로 이동
      router.push('/dashboard/matches');
    } catch (err: any) {
      alert(err.response?.data?.message || '경기 삭제에 실패했습니다.');
    }
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

  const getCurrentUserAttendance = (): 'attending' | 'not_attending' | 'maybe' | undefined => {
    if (!user || !match.attendances) {
      return undefined;
    }
    
    // 현재 사용자의 참석 정보 찾기
    const userAttendance = match.attendances.find(
      (attendance) => attendance.userId === user.id
    );
    
    if (!userAttendance) {
      return undefined;
    }
    
    // 투표 가능한 상태만 반환 (late, absent는 투표 상태가 아니므로 제외)
    const status = userAttendance.status;
    if (status === 'attending' || status === 'not_attending' || status === 'maybe') {
      return status;
    }
    
    return undefined;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 경기 요약 정보 */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">경기 정보</h2>
          {canEdit && (
            <div className="flex flex-wrap gap-2">
              <Link href={`/dashboard/matches/${matchId}/record`}>
                <Button variant="primary" size="sm">
                  기록 입력
                </Button>
              </Link>
              <Link href={`/dashboard/matches/${matchId}/edit`}>
                <Button variant="outline" size="sm">
                  수정
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
                onClick={handleDelete}
              >
                삭제
              </Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
      {games.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">게임별 상세</h3>
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

