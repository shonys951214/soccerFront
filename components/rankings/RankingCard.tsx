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
      className={`flex items-center justify-between p-4 rounded-lg border ${getRankColor(
        player.rank
      )}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 text-center font-bold text-gray-700">
          {getRankIcon(player.rank)}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{player.userName}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-gray-900">{formatValue(player.value)}</p>
      </div>
    </div>
  );
}

