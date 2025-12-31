'use client';

import { RankingPlayer } from '@/lib/types/rankings.types';

interface RankingCardProps {
  player: RankingPlayer;
  type: 'attendance' | 'games' | 'goals' | 'assists';
}

export default function RankingCard({ player, type }: RankingCardProps) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 border-yellow-300';
    if (rank === 2) return 'bg-gray-100 border-gray-300';
    if (rank === 3) return 'bg-orange-100 border-orange-300';
    return 'bg-white border-gray-200';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}등`;
  };

  const formatValue = (value: number) => {
    return value.toString();
  };

  return (
    <div
      className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border ${getRankColor(
        player.rank
      )}`}
    >
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <div className="w-8 sm:w-12 text-center font-bold text-gray-700 text-sm sm:text-base flex-shrink-0">
          {getRankIcon(player.rank)}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{player.userName}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatValue(player.value)}</p>
      </div>
    </div>
  );
}

