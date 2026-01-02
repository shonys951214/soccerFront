'use client';

import { useState } from 'react';
import { Top10Player } from '@/lib/types/dashboard.types';

interface Top10ListProps {
  appearances?: Top10Player[];
  goals?: Top10Player[];
  assists?: Top10Player[];
  winRate?: Top10Player[];
}

type TabType = 'appearances' | 'goals' | 'assists' | 'winRate';

export default function Top10List({
  appearances = [],
  goals = [],
  assists = [],
  winRate = [],
}: Top10ListProps) {
  const [activeTab, setActiveTab] = useState<TabType>('appearances');

  const tabs = [
    { id: 'appearances' as TabType, label: '출전 수', players: appearances },
    { id: 'goals' as TabType, label: '득점', players: goals },
    { id: 'assists' as TabType, label: '도움', players: assists },
    { id: 'winRate' as TabType, label: '승률', players: winRate },
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const activePlayers = activeTabData?.players || [];
  const formatValue = activeTab === 'winRate' 
    ? (v: number) => `${(v * 100).toFixed(1)}%`
    : (v: number) => v.toString();

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 h-full flex flex-col">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Top10</h2>
      
      {/* 탭 버튼 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top10 선수 목록 */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          {activePlayers.length > 0 ? (
            activePlayers.slice(0, 10).map((player, index) => (
              <div
                key={player.userId}
                className="flex items-center justify-between text-xs sm:text-sm p-2 bg-gray-50 rounded"
              >
                <span className="text-gray-600 truncate min-w-0 flex-1">
                  {index + 1}. {player.userName}
                </span>
                <span className="font-semibold text-gray-900 ml-2 flex-shrink-0">
                  {formatValue(player.value)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-sm text-gray-500">
              데이터가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

