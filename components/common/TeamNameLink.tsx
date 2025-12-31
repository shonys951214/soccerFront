'use client';

import Link from 'next/link';
import { useTeamId } from '@/lib/hooks/useTeamId';
import { teamsApi } from '@/lib/api/teams.api';
import { useEffect, useState } from 'react';

export default function TeamNameLink() {
  const { teamId } = useTeamId();
  const [teamName, setTeamName] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamName = async () => {
      if (teamId) {
        try {
          const team = await teamsApi.getMyTeam();
          if (team) {
            setTeamName(team.teamName);
          }
        } catch (error) {
          console.error('Failed to fetch team name:', error);
        }
      }
    };

    fetchTeamName();
  }, [teamId]);

  if (!teamId || !teamName) {
    return null;
  }

  return (
    <Link
      href="/dashboard/my-team"
      className="text-red-600 hover:text-red-700 underline font-medium"
    >
      마이 팀 &lt;&lt; {teamName}
    </Link>
  );
}

