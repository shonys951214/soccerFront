'use client';

import { useState } from 'react';
import { RankingPlayer } from '@/lib/types/rankings.types';
import RankingCard from './RankingCard';

interface RankingTabsProps {
  attendance: RankingPlayer[];
  games: RankingPlayer[];
  goals: RankingPlayer[];
  assists: RankingPlayer[];
}

type TabType = 'attendance' | 'games' | 'goals' | 'assists';

export default function RankingTabs({
  attendance,
  games,
  goals,
  assists,
}: RankingTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('attendance');

  const tabs = [
    { id: 'attendance' as TabType, label: '참석 경기', data: attendance },
    { id: 'games' as TabType, label: '출전 게임', data: games },
    { id: 'goals' as TabType, label: '득점', data: goals },
    { id: 'assists' as TabType, label: '도움', data: assists },
  ];

  const activeData = tabs.find((tab) => tab.id === activeTab)?.data || [];

  return (
    <div className="space-y-6">
      {/* 탭 버튼 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 랭킹 리스트 */}
      <div className="space-y-3">
        {activeData.slice(0, 5).map((player) => (
          <RankingCard
            key={player.userId}
            player={player}
            type={activeTab}
          />
        ))}
      </div>
    </div>
  );
}

