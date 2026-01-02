'use client';

import { useState, useEffect } from 'react';
import { matchesApi } from '@/lib/api/matches.api';
import { teamsApi } from '@/lib/api/teams.api';
import { RecordMatchRequest, GameRecord, PlayerRecord } from '@/lib/types/match.types';
import { TeamMember } from '@/lib/types/team.types';
import MatchRecordTable from './MatchRecordTable';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';

interface MatchRecordFormProps {
  matchId: string;
  teamId: string;
  onSuccess: () => void;
}

export default function MatchRecordForm({
  matchId,
  teamId,
  onSuccess,
}: MatchRecordFormProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [games, setGames] = useState<GameRecord[]>([]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // 멤버 정보 가져오기 (한 번만 실행)
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await teamsApi.getTeamMembers(teamId);
        setMembers(data);
      } catch (err: unknown) {
        setError('팀원 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [teamId]);

  // games 초기화 (한 번만 실행)
  useEffect(() => {
    if (!isInitialized && members.length > 0 && games.length === 0) {
      const initialPlayerRecords: PlayerRecord[] = members.map((member) => ({
        userId: member.userId,
        userName: member.userName || member.name || '',
        played: false,
        goals: 0,
        assists: 0,
      }));
      setGames([
        {
          gameNumber: 1,
          ourScore: 0,
          opponentScore: 0,
          playerRecords: initialPlayerRecords,
        },
      ]);
      setIsInitialized(true);
    }
  }, [members, isInitialized, games.length]);

  const handleAddGame = () => {
    const newGameNumber = games.length + 1;
    const initialPlayerRecords: PlayerRecord[] = members.map((member) => ({
      userId: member.userId,
      userName: member.userName || member.name || '',
      played: false,
      goals: 0,
      assists: 0,
    }));
    setGames([
      ...games,
      {
        gameNumber: newGameNumber,
        ourScore: 0,
        opponentScore: 0,
        playerRecords: initialPlayerRecords,
      },
    ]);
  };

  const handleRemoveGame = (index: number) => {
    if (games.length > 1) {
      setGames(games.filter((_, i) => i !== index));
    }
  };

  const handleGamesChange = (newGames: GameRecord[]) => {
    setGames(newGames);
  };

  const handlePlayerRecordChange = (gameIndex: number, userId: string, record: PlayerRecord) => {
    const newGames = [...games];
    const game = newGames[gameIndex];
    const playerIndex = game.playerRecords.findIndex((pr) => pr.userId === userId);
    
    if (playerIndex >= 0) {
      game.playerRecords[playerIndex] = record;
    } else {
      game.playerRecords.push(record);
    }
    
    newGames[gameIndex] = game;
    setGames(newGames);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    const hasScore = games.some(
      (g) => g.ourScore > 0 || g.opponentScore > 0
    );
    if (!hasScore) {
      setError('최소 1개 게임의 점수를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const request: RecordMatchRequest = {
        games: games.map((g) => {
          // result 계산
          let result: 'win' | 'draw' | 'loss';
          if (g.ourScore > g.opponentScore) {
            result = 'win';
          } else if (g.ourScore < g.opponentScore) {
            result = 'loss';
          } else {
            result = 'draw';
          }

          return {
            gameNumber: g.gameNumber,
            ourScore: g.ourScore,
            opponentScore: g.opponentScore,
            result,
            playerRecords: g.playerRecords.filter((pr) => pr.played),
          };
        }),
        notes: notes.trim() || undefined,
      };
      await matchesApi.recordMatch(matchId, request);
      onSuccess();
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '경기 기록 입력에 실패했습니다.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading size="lg" className="py-12" />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 통합 테이블 */}
      <MatchRecordTable
        games={games}
        members={members}
        onGamesChange={handleGamesChange}
        onPlayerRecordChange={handlePlayerRecordChange}
        onAddGame={handleAddGame}
        onRemoveGame={handleRemoveGame}
      />

      {/* 회고 메모 */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          회고 메모 (선택)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="경기 후기를 작성하세요"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          className="flex-1"
          disabled={isSubmitting}
        >
          취소
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="flex-1"
        >
          저장하기
        </Button>
      </div>
    </form>
  );
}

