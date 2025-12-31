'use client';

import { useState, useEffect } from 'react';
import { teamsApi } from '@/lib/api/teams.api';
import { Team } from '@/lib/types/team.types';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';

interface JoinTeamListProps {
  onJoin: (teamId: string) => Promise<void>;
  isLoading?: boolean;
}

export default function JoinTeamList({ onJoin, isLoading = false }: JoinTeamListProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await teamsApi.getPublicTeams();
        setTeams(data);
      } catch (err: any) {
        setError('팀 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  if (teams.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8">
        등록된 팀이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {teams.map((team) => (
        <div
          key={team.id}
          className="p-4 bg-white rounded-lg border border-gray-200 hover:border-red-500 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{team.name}</h3>
              {team.region && (
                <p className="text-sm text-gray-600 mt-1">{team.region}</p>
              )}
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onJoin(team.id)}
              isLoading={isLoading}
            >
              가입하기
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

