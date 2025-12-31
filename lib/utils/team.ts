import { teamsApi } from '@/lib/api/teams.api';

/**
 * 사용자가 속한 팀 ID를 가져옵니다.
 * 현재는 첫 번째 팀을 반환하지만, 실제로는 사용자가 속한 팀을 조회해야 합니다.
 * TODO: 백엔드에 사용자 팀 조회 API가 추가되면 수정 필요
 */
export async function getUserTeamId(): Promise<string | null> {
  try {
    // 임시: 공개 팀 목록에서 첫 번째 팀을 반환
    // 실제로는 사용자가 속한 팀을 조회하는 API가 필요
    const teams = await teamsApi.getPublicTeams();
    return teams.length > 0 ? teams[0].id : null;
  } catch (error) {
    console.error('Failed to get user team:', error);
    return null;
  }
}

