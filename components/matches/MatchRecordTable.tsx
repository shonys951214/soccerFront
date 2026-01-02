'use client';

import { useState } from 'react';
import { GameRecord, PlayerRecord } from '@/lib/types/match.types';
import { TeamMember } from '@/lib/types/team.types';
import Button from '@/components/common/Button';

interface MatchRecordTableProps {
  games: GameRecord[];
  members: TeamMember[];
  onGamesChange: (games: GameRecord[]) => void;
  onPlayerRecordChange: (gameIndex: number, userId: string, record: PlayerRecord) => void;
  onAddGame: () => void;
  onRemoveGame: (index: number) => void;
}

export default function MatchRecordTable({
  games,
  members,
  onGamesChange,
  onPlayerRecordChange,
  onAddGame,
  onRemoveGame,
}: MatchRecordTableProps) {
  const [editingGoalAssist, setEditingGoalAssist] = useState<{
    gameIndex: number;
    userId: string;
  } | null>(null);

  // 게임별 통계 계산
  const calculateGameStats = (game: GameRecord) => {
    const result =
      game.ourScore > game.opponentScore
        ? '승'
        : game.ourScore < game.opponentScore
        ? '패'
        : '무';
    const win = result === '승' ? 1 : 0;
    const loss = result === '패' ? 1 : 0;
    const draw = result === '무' ? 1 : 0;
    const winRate = games.length > 0 ? (win / games.length) * 100 : 0;
    const totalGoals = game.playerRecords.reduce((sum, pr) => sum + pr.goals, 0);
    const totalAssists = game.playerRecords.reduce((sum, pr) => sum + pr.assists, 0);
    const cleanSheet = game.opponentScore === 0 ? 1 : 0;
    const noGoal = game.ourScore === 0 ? 1 : 0;

    return {
      result,
      win,
      loss,
      draw,
      winRate,
      totalGoals,
      totalAssists,
      cleanSheet,
      noGoal,
    };
  };

  // Total 행 통계 계산
  const calculateTotalStats = () => {
    const totalWin = games.reduce((sum, g) => sum + (g.ourScore > g.opponentScore ? 1 : 0), 0);
    const totalLoss = games.reduce((sum, g) => sum + (g.ourScore < g.opponentScore ? 1 : 0), 0);
    const totalDraw = games.reduce((sum, g) => sum + (g.ourScore === g.opponentScore ? 1 : 0), 0);
    const totalWinRate = games.length > 0 ? (totalWin / games.length) * 100 : 0;
    const totalGoals = games.reduce(
      (sum, g) => sum + g.playerRecords.reduce((s, pr) => s + pr.goals, 0),
      0
    );
    const totalAssists = games.reduce(
      (sum, g) => sum + g.playerRecords.reduce((s, pr) => s + pr.assists, 0),
      0
    );
    const totalOurScore = games.reduce((sum, g) => sum + g.ourScore, 0);
    const totalOpponentScore = games.reduce((sum, g) => sum + g.opponentScore, 0);
    const totalCleanSheet = games.filter((g) => g.opponentScore === 0).length;
    const totalNoGoal = games.filter((g) => g.ourScore === 0).length;

    return {
      totalWin,
      totalLoss,
      totalDraw,
      totalWinRate,
      totalGoals,
      totalAssists,
      totalOurScore,
      totalOpponentScore,
      totalCleanSheet,
      totalNoGoal,
    };
  };

  // 선수별 통계 계산
  const calculatePlayerStats = (userId: string) => {
    let appearances = 0;
    let wins = 0;
    let losses = 0;
    let draws = 0;
    let goals = 0;
    let assists = 0;
    let cleanSheets = 0;

    games.forEach((game) => {
      const playerRecord = game.playerRecords.find((pr) => pr.userId === userId);
      if (playerRecord?.played) {
        appearances++;
        if (game.ourScore > game.opponentScore) wins++;
        else if (game.ourScore < game.opponentScore) losses++;
        else draws++;
        goals += playerRecord.goals;
        assists += playerRecord.assists;
        if (game.opponentScore === 0) cleanSheets++;
      }
    });

    const winRate = appearances > 0 ? (wins / appearances) * 100 : 0;
    const points = appearances * 2 + wins * 1 + draws * 0.5 + 0.5 * (goals + assists + cleanSheets);

    return {
      appearances,
      wins,
      losses,
      draws,
      winRate,
      goals,
      assists,
      cleanSheets,
      points,
    };
  };

  const handleScoreChange = (gameIndex: number, field: 'ourScore' | 'opponentScore', value: number) => {
    const newGames = [...games];
    newGames[gameIndex] = {
      ...newGames[gameIndex],
      [field]: value,
    };
    onGamesChange(newGames);
  };

  const handlePlayerPlayedChange = (gameIndex: number, userId: string, played: boolean) => {
    const game = games[gameIndex];
    const playerRecord = game.playerRecords.find((pr) => pr.userId === userId) || {
      userId,
      userName: members.find((m) => m.userId === userId)?.userName || '',
      played: false,
      goals: 0,
      assists: 0,
    };

    onPlayerRecordChange(gameIndex, userId, {
      ...playerRecord,
      played,
      goals: played ? playerRecord.goals : 0,
      assists: played ? playerRecord.assists : 0,
    });
  };

  const handleGoalAssistClick = (gameIndex: number, userId: string) => {
    setEditingGoalAssist({ gameIndex, userId });
  };

  const handleGoalAssistSave = (goals: number, assists: number) => {
    if (editingGoalAssist) {
      const game = games[editingGoalAssist.gameIndex];
      const playerRecord = game.playerRecords.find((pr) => pr.userId === editingGoalAssist.userId) || {
        userId: editingGoalAssist.userId,
        userName: members.find((m) => m.userId === editingGoalAssist.userId)?.userName || '',
        played: true,
        goals: 0,
        assists: 0,
      };

      onPlayerRecordChange(editingGoalAssist.gameIndex, editingGoalAssist.userId, {
        ...playerRecord,
        played: true,
        goals,
        assists,
      });
    }
    setEditingGoalAssist(null);
  };

  const totalStats = calculateTotalStats();

  return (
    <div className="space-y-6">
      {/* 경기 요약 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">경기</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">게임</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">우리팀</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">상대팀</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">승</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">패</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">무</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">승률</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">득점</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">도움</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">실점</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">무실점</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">무득점</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game, index) => {
                const stats = calculateGameStats(game);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-b border-gray-200 font-medium">{index + 1}G</td>
                    <td className="px-3 py-2 border-b border-gray-200">
                      <input
                        type="number"
                        min="0"
                        value={game.ourScore}
                        onChange={(e) => handleScoreChange(index, 'ourScore', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-center"
                      />
                    </td>
                    <td className="px-3 py-2 border-b border-gray-200">
                      <input
                        type="number"
                        min="0"
                        value={game.opponentScore}
                        onChange={(e) => handleScoreChange(index, 'opponentScore', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-center"
                      />
                    </td>
                    <td className="px-3 py-2 border-b border-gray-200 text-center">{stats.win}</td>
                    <td className="px-3 py-2 border-b border-gray-200 text-center">{stats.loss}</td>
                    <td className="px-3 py-2 border-b border-gray-200 text-center">{stats.draw}</td>
                    <td className="px-3 py-2 border-b border-gray-200 text-center">{stats.winRate.toFixed(1)}%</td>
                    <td className="px-3 py-2 border-b border-gray-200 text-center">{stats.totalGoals}</td>
                    <td className="px-3 py-2 border-b border-gray-200 text-center">{stats.totalAssists}</td>
                    <td className="px-3 py-2 border-b border-gray-200 text-center">{game.opponentScore}</td>
                    <td className="px-3 py-2 border-b border-gray-200 text-center">{stats.cleanSheet}</td>
                    <td className="px-3 py-2 border-b border-gray-200 text-center">{stats.noGoal}</td>
                  </tr>
                );
              })}
              {/* Total 행 */}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-3 py-2 border-b border-gray-200">Total</td>
                <td className="px-3 py-2 border-b border-gray-200 text-center">{totalStats.totalOurScore}</td>
                <td className="px-3 py-2 border-b border-gray-200 text-center">{totalStats.totalOpponentScore}</td>
                <td className="px-3 py-2 border-b border-gray-200 text-center">{totalStats.totalWin}</td>
                <td className="px-3 py-2 border-b border-gray-200 text-center">{totalStats.totalLoss}</td>
                <td className="px-3 py-2 border-b border-gray-200 text-center">{totalStats.totalDraw}</td>
                <td className="px-3 py-2 border-b border-gray-200 text-center">{totalStats.totalWinRate.toFixed(1)}%</td>
                <td className="px-3 py-2 border-b border-gray-200 text-center">{totalStats.totalGoals}</td>
                <td className="px-3 py-2 border-b border-gray-200 text-center">{totalStats.totalAssists}</td>
                <td className="px-3 py-2 border-b border-gray-200 text-center">{totalStats.totalOpponentScore}</td>
                <td className="px-3 py-2 border-b border-gray-200 text-center">{totalStats.totalCleanSheet}</td>
                <td className="px-3 py-2 border-b border-gray-200 text-center">{totalStats.totalNoGoal}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onAddGame}>
            게임 추가
          </Button>
          {games.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRemoveGame(games.length - 1)}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              마지막 게임 삭제
            </Button>
          )}
        </div>
      </div>

      {/* 스쿼드 상세 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">스쿼드</h3>
          <p className="text-xs text-gray-600 mt-1">
            선수 → [포메이션] 반영 포인트 = 출석*2 + 승*1 + 무*0.5 + 0.5*(득점+도움+무실) 자동체크
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">No.</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">선수</th>
                {games.map((_, index) => (
                  <th key={index} className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">
                    {index + 1}G
                  </th>
                ))}
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">출전수</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">승</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">패</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">무</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">승률</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">득점</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">도움</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">무실점</th>
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b border-gray-200">포인트</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, memberIndex) => {
                const playerStats = calculatePlayerStats(member.userId);
                return (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-b border-gray-200 text-center">
                      {member.jerseyNumber || memberIndex + 1}
                    </td>
                    <td className="px-3 py-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <img
                          src={member.profileImage || '/profile_default_image.png'}
                          alt={member.name || member.userName || ''}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-medium">{member.name || member.userName || '이름 없음'}</span>
                      </div>
                    </td>
                    {games.map((game, gameIndex) => {
                      const playerRecord = game.playerRecords.find((pr) => pr.userId === member.userId) || {
                        userId: member.userId,
                        userName: member.userName || member.name || '',
                        played: false,
                        goals: 0,
                        assists: 0,
                      };
                      return (
                        <td key={gameIndex} className="px-3 py-2 border-b border-gray-200">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <input
                              type="checkbox"
                              checked={playerRecord.played}
                              onChange={(e) =>
                                handlePlayerPlayedChange(gameIndex, member.userId, e.target.checked)
                              }
                              className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                            />
                            {playerRecord.played && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleGoalAssistClick(gameIndex, member.userId)}
                                className={`text-xs ${
                                  playerRecord.goals > 0 || playerRecord.assists > 0
                                    ? 'text-red-600 border-red-300'
                                    : 'text-gray-500'
                                }`}
                              >
                                {playerRecord.goals > 0 || playerRecord.assists > 0
                                  ? `${playerRecord.goals}골 ${playerRecord.assists}도움`
                                  : '골|도움'}
                              </Button>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 border-b border-gray-200 text-center">{playerStats.appearances}</td>
                    <td className="px-3 py-2 border-b border-gray-200 text-center">{playerStats.wins}</td>
                    <td className="px-3 py-2 border-b border-gray-200 text-center">{playerStats.losses}</td>
                    <td className="px-3 py-2 border-b border-gray-200 text-center">{playerStats.draws}</td>
                    <td className="px-3 py-2 border-b border-gray-200 text-center">
                      {playerStats.winRate.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2 border-b border-gray-200 text-center">{playerStats.goals}</td>
                    <td className="px-3 py-2 border-b border-gray-200 text-center">{playerStats.assists}</td>
                    <td className="px-3 py-2 border-b border-gray-200 text-center">{playerStats.cleanSheets}</td>
                    <td className="px-3 py-2 border-b border-gray-200 text-center font-semibold">
                      {playerStats.points.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 골/도움 입력 모달 */}
      {editingGoalAssist && (
        <GoalAssistModal
          playerName={
            members.find((m) => m.userId === editingGoalAssist.userId)?.userName ||
            members.find((m) => m.userId === editingGoalAssist.userId)?.name ||
            ''
          }
          gameNumber={editingGoalAssist.gameIndex + 1}
          initialGoals={
            games[editingGoalAssist.gameIndex].playerRecords.find(
              (pr) => pr.userId === editingGoalAssist.userId
            )?.goals || 0
          }
          initialAssists={
            games[editingGoalAssist.gameIndex].playerRecords.find(
              (pr) => pr.userId === editingGoalAssist.userId
            )?.assists || 0
          }
          onSave={handleGoalAssistSave}
          onClose={() => setEditingGoalAssist(null)}
        />
      )}
    </div>
  );
}

// 골/도움 입력 모달
interface GoalAssistModalProps {
  playerName: string;
  gameNumber: number;
  initialGoals: number;
  initialAssists: number;
  onSave: (goals: number, assists: number) => void;
  onClose: () => void;
}

function GoalAssistModal({
  playerName,
  gameNumber,
  initialGoals,
  initialAssists,
  onSave,
  onClose,
}: GoalAssistModalProps) {
  const [goals, setGoals] = useState(initialGoals);
  const [assists, setAssists] = useState(initialAssists);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(goals, assists);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {playerName} - {gameNumber}G 골/도움 입력
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">득점</label>
            <input
              type="number"
              min="0"
              value={goals}
              onChange={(e) => setGoals(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">도움</label>
            <input
              type="number"
              min="0"
              value={assists}
              onChange={(e) => setAssists(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              취소
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              저장
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

