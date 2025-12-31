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
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
              <p className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">{formatDate(match.date)}</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                vs {match.opponentTeamName}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <span className="whitespace-nowrap">게임: {match.gameCount}</span>
              <span className="text-green-600 whitespace-nowrap">승: {match.wins}</span>
              <span className="text-gray-600 whitespace-nowrap">무: {match.draws}</span>
              <span className="text-red-600 whitespace-nowrap">패: {match.losses}</span>
              <span className="whitespace-nowrap">득점: {match.totalGoals}</span>
              <span className="whitespace-nowrap">도움: {match.totalAssists}</span>
              <span className="whitespace-nowrap">실점: {match.totalOpponentGoals}</span>
            </div>
          </div>
          <div className="ml-2 sm:ml-4 flex-shrink-0">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
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

