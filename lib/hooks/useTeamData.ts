import { useState, useEffect } from 'react';
import { teamsApi } from '@/lib/api/teams.api';
import { TeamDetail, UserTeam } from '@/lib/types/team.types';
import { getErrorMessage } from '@/lib/utils/error';

export function useTeamData(teamId: string | null) {
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [userTeam, setUserTeam] = useState<UserTeam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!teamId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');
      try {
        const [teamData, userTeamData] = await Promise.all([
          teamsApi.getTeam(teamId),
          teamsApi.getMyTeam(),
        ]);
        setTeam(teamData);
        setUserTeam(userTeamData);
      } catch (err) {
        setError(getErrorMessage(err, '팀 정보를 불러오는데 실패했습니다.'));
        console.error('Failed to fetch team:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [teamId]);

  const refreshTeam = async () => {
    if (!teamId) return;
    try {
      const updatedTeam = await teamsApi.getTeam(teamId);
      setTeam(updatedTeam);
    } catch (err) {
      console.error('Failed to refresh team:', err);
    }
  };

  return {
    team,
    userTeam,
    isLoading,
    error,
    refreshTeam,
  };
}

