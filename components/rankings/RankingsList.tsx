'use client';

import { useEffect, useState } from 'react';
import { rankingsApi } from '@/lib/api/rankings.api';
import { Rankings } from '@/lib/types/rankings.types';
import RankingTabs from './RankingTabs';
import Loading from '@/components/common/Loading';

interface RankingsListProps {
  teamId: string;
}

export default function RankingsList({ teamId }: RankingsListProps) {
  const [rankings, setRankings] = useState<Rankings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const data = await rankingsApi.getRankings(teamId);
        setRankings(data);
      } catch (err: any) {
        setError('랭킹 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (teamId) {
      fetchRankings();
    }
  }, [teamId]);

  if (isLoading) {
    return <Loading size="lg" className="py-12" />;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

  if (!rankings) {
    return <div className="text-gray-500 text-center py-8">랭킹 데이터가 없습니다.</div>;
  }

  return (
    <RankingTabs
      attendance={rankings.attendance}
      games={rankings.games}
      goals={rankings.goals}
      assists={rankings.assists}
    />
  );
}

