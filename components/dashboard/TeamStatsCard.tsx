'use client';

import { TeamStats, GameStats, TotalGoals } from '@/lib/types/dashboard.types';

interface TeamStatsCardProps {
  matchStats?: TeamStats;
  gameStats?: GameStats;
  totalGoals?: TotalGoals;
}

export default function TeamStatsCard({
  matchStats,
  gameStats,
  totalGoals,
}: TeamStatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900">팀 기록</h2>

      {/* 경기별 통계 */}
      {matchStats && (
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3">경기별 통계</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <StatItem label="경기 수" value={matchStats.matchCount} />
            <StatItem label="승" value={matchStats.wins} />
            <StatItem label="무" value={matchStats.draws} />
            <StatItem label="패" value={matchStats.losses} />
            <StatItem label="경기당 득점" value={matchStats.goalsPerMatch.toFixed(2)} />
            <StatItem label="경기당 실점" value={matchStats.concededPerMatch.toFixed(2)} />
            <StatItem label="무실점 비율" value={`${(matchStats.cleanSheetRate * 100).toFixed(1)}%`} />
            <StatItem label="무득점 비율" value={`${(matchStats.noGoalRate * 100).toFixed(1)}%`} />
          </div>
        </div>
      )}

      {/* 게임별 통계 */}
      {gameStats && (
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3">게임별 통계</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <StatItem label="게임 수" value={gameStats.gameCount} />
            <StatItem label="승" value={gameStats.wins} />
            <StatItem label="무" value={gameStats.draws} />
            <StatItem label="패" value={gameStats.losses} />
            <StatItem label="게임당 득점" value={gameStats.goalsPerGame.toFixed(2)} />
            <StatItem label="게임당 실점" value={gameStats.concededPerGame.toFixed(2)} />
            <StatItem label="무실점 비율" value={`${(gameStats.cleanSheetRate * 100).toFixed(1)}%`} />
            <StatItem label="무득점 비율" value={`${(gameStats.noGoalRate * 100).toFixed(1)}%`} />
          </div>
        </div>
      )}

      {/* 총 득실 */}
      {totalGoals && (
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3">총 득실</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <StatItem label="총 득점" value={totalGoals.totalGoals} />
            <StatItem label="총 실점" value={totalGoals.totalConceded} />
            <StatItem label="득실차" value={totalGoals.goalDifference} />
            <StatItem label="도움" value={totalGoals.assists} />
            <StatItem label="필드 골" value={totalGoals.fieldGoals} />
            <StatItem label="프리킥 골" value={totalGoals.freeKickGoals} />
            <StatItem label="페널티 골" value={totalGoals.penaltyGoals} />
            <StatItem label="자책골" value={totalGoals.ownGoals} />
          </div>
        </div>
      )}
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center p-3 bg-gray-50 rounded">
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}

