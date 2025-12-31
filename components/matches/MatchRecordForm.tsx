'use client';

import { useState, useEffect } from 'react';
import { matchesApi } from '@/lib/api/matches.api';
import { teamsApi } from '@/lib/api/teams.api';
import { RecordMatchRequest, GameRecord, PlayerRecord } from '@/lib/types/match.types';
import { TeamMember } from '@/lib/types/team.types';
import GameScoreInput from './GameScoreInput';
import PlayerRecordInput from './PlayerRecordInput';
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
  const [games, setGames] = useState<GameRecord[]>([
    {
      gameNumber: 1,
      ourScore: 0,
      opponentScore: 0,
      playerRecords: [],
    },
  ]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await teamsApi.getTeamMembers(teamId);
        setMembers(data);
        // 초기 playerRecords 설정
        const initialPlayerRecords: PlayerRecord[] = data.map((member) => ({
          userId: member.userId,
          userName: member.userName || '',
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
      } catch (err: any) {
        setError('팀원 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [teamId]);

  const handleAddGame = () => {
    const newGameNumber = games.length + 1;
    const initialPlayerRecords: PlayerRecord[] = members.map((member) => ({
      userId: member.userId,
      userName: member.userName || '',
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

  const handleGameChange = (index: number, game: GameRecord) => {
    const newGames = [...games];
    newGames[index] = game;
    setGames(newGames);
  };

  const handlePlayerRecordChange = (
    gameIndex: number,
    playerIndex: number,
    record: PlayerRecord
  ) => {
    const newGames = [...games];
    newGames[gameIndex].playerRecords[playerIndex] = record;
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
        games: games.map((g) => ({
          ...g,
          playerRecords: g.playerRecords.filter((pr) => pr.played),
        })),
        notes: notes.trim() || undefined,
      };
      await matchesApi.recordMatch(matchId, request);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || '경기 기록 입력에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading size="lg" className="py-12" />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 게임별 점수 입력 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">게임별 점수</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddGame}
          >
            게임 추가
          </Button>
        </div>
        {games.map((game, index) => (
          <div key={index} className="relative">
            <GameScoreInput
              gameNumber={game.gameNumber}
              game={game}
              onChange={(g) => handleGameChange(index, g)}
            />
            {games.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveGame(index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-700"
              >
                삭제
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 선수별 기록 입력 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">출전 멤버 및 기록</h3>
        {games.map((game, gameIndex) => (
          <div key={gameIndex} className="space-y-3">
            <h4 className="font-medium text-gray-700">게임 {game.gameNumber}</h4>
            <div className="space-y-2">
              {members.map((member, memberIndex) => {
                const playerRecord =
                  game.playerRecords[memberIndex] ||
                  ({
                    userId: member.userId,
                    userName: member.userName || '',
                    played: false,
                    goals: 0,
                    assists: 0,
                  } as PlayerRecord);

                return (
                  <PlayerRecordInput
                    key={member.id}
                    player={{
                      id: member.userId,
                      name: member.userName || '',
                    }}
                    record={playerRecord}
                    onChange={(record) =>
                      handlePlayerRecordChange(gameIndex, memberIndex, record)
                    }
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 회고 메모 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          회고 메모 (선택)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="경기 후기를 작성하세요"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

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

