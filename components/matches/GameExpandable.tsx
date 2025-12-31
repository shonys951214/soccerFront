'use client';

import { useState } from 'react';
import { Game } from '@/lib/types/match.types';

interface GameExpandableProps {
  game: Game;
  gameRecords?: any[]; // TODO: MatchRecord 타입 정의 필요
}

export default function GameExpandable({ game, gameRecords }: GameExpandableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getResultText = (result: string) => {
    switch (result) {
      case 'win':
        return '승';
      case 'draw':
        return '무';
      case 'loss':
        return '패';
      default:
        return result;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'win':
        return 'text-green-600';
      case 'draw':
        return 'text-gray-600';
      case 'loss':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-900">게임 {game.gameNumber}</span>
          <span className="text-lg font-bold text-gray-900">
            {game.ourScore} - {game.opponentScore}
          </span>
          <span className={`font-semibold ${getResultColor(game.result)}`}>
            {getResultText(game.result)}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isExpanded ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          {/* 골 기록 */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">골 기록</p>
            {gameRecords && gameRecords.length > 0 ? (
              <div className="space-y-1">
                {gameRecords.map((record, idx) => (
                  <div key={idx} className="text-sm text-gray-600">
                    {record.userName} ({record.goalTime}분)
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">골 기록이 없습니다.</p>
            )}
          </div>

          {/* 도움 기록 */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">도움 기록</p>
            <p className="text-sm text-gray-400">도움 기록이 없습니다.</p>
          </div>

          {/* 교체 기록 */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">교체 기록</p>
            <p className="text-sm text-gray-400">교체 기록이 없습니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}

