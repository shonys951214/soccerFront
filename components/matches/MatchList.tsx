'use client';

import { useEffect, useState, useCallback } from 'react';
import { matchesApi } from '@/lib/api/matches.api';
import { MatchListItem as MatchListItemType } from '@/lib/types/match.types';
import MatchFilter from './MatchFilter';
import MatchListItem from './MatchListItem';
import CreateMatchButton from './CreateMatchButton';
import Loading from '@/components/common/Loading';

interface MatchListProps {
  teamId: string;
  canCreate?: boolean;
}

export default function MatchList({ teamId, canCreate = false }: MatchListProps) {
  const [matches, setMatches] = useState<MatchListItemType[]>([]);
  const [year, setYear] = useState<number | null>(new Date().getFullYear());
  const [month, setMonth] = useState<number | null>(new Date().getMonth() + 1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMatches = useCallback(async (selectedYear: number | null, selectedMonth: number | null) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await matchesApi.getMatches(teamId, selectedYear || undefined, selectedMonth || undefined);
      setMatches(data);
    } catch (err: unknown) {
      setError('경기 목록을 불러오는데 실패했습니다.');
      console.error('Failed to fetch matches:', err);
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    if (teamId) {
      fetchMatches(year, month);
    }
  }, [teamId, year, month, fetchMatches]);

  const handleFilterChange = useCallback((selectedYear: number | null, selectedMonth: number | null) => {
    setYear(selectedYear);
    setMonth(selectedMonth);
  }, []);

  const handleCreateSuccess = () => {
    fetchMatches(year, month);
  };

  if (isLoading) {
    return <Loading size="lg" className="py-12" />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
        <MatchFilter 
          onFilterChange={handleFilterChange} 
          initialYear={year}
          initialMonth={month}
        />
        {canCreate && (
          <CreateMatchButton teamId={teamId} onSuccess={handleCreateSuccess} />
        )}
      </div>

      {error && (
        <div className="text-red-600 text-center py-4">{error}</div>
      )}

      {matches.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          해당 기간에 등록된 경기가 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => (
            <MatchListItem key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

