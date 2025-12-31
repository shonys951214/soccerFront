'use client';

import { Top10Player } from '@/lib/types/dashboard.types';

interface Top10ListProps {
  appearances: Top10Player[];
  goals: Top10Player[];
  assists: Top10Player[];
  winRate: Top10Player[];
}

export default function Top10List({
  appearances,
  goals,
  assists,
  winRate,
}: Top10ListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Top10</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Top10Section title="출전 수" players={appearances} />
        <Top10Section title="득점" players={goals} />
        <Top10Section title="도움" players={assists} />
        <Top10Section title="승률" players={winRate} formatValue={(v) => `${(v * 100).toFixed(1)}%`} />
      </div>
    </div>
  );
}

function Top10Section({
  title,
  players,
  formatValue = (v) => v.toString(),
}: {
  title: string;
  players: Top10Player[];
  formatValue?: (value: number) => string;
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div className="space-y-1">
        {players.slice(0, 10).map((player, index) => (
          <div
            key={player.userId}
            className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
          >
            <span className="text-gray-600">
              {index + 1}. {player.userName}
            </span>
            <span className="font-semibold text-gray-900">
              {formatValue(player.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

