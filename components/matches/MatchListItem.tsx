'use client';

import Link from 'next/link';
import { MatchListItem as MatchListItemType } from '@/lib/types/match.types';

interface MatchListItemProps {
  match: MatchListItemType;
}

export default function MatchListItem({ match }: MatchListItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} (${weekdays[date.getDay()]})`;
  };

  return (
    <Link href={`/dashboard/matches/${match.id}`}>
      <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <p className="text-sm text-gray-600">{formatDate(match.date)}</p>
              <p className="text-lg font-semibold text-gray-900">
                vs {match.opponentTeamName}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>게임 수: {match.gameCount}</span>
              <span className="text-green-600">승: {match.wins}</span>
              <span className="text-gray-600">무: {match.draws}</span>
              <span className="text-red-600">패: {match.losses}</span>
              <span>득점: {match.totalGoals}</span>
              <span>도움: {match.totalAssists}</span>
              <span>실점: {match.totalOpponentGoals}</span>
            </div>
          </div>
          <div className="ml-4">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

