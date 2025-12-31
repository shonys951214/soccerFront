import { teamsApi } from "@/lib/api/teams.api";

/**
 * 사용자가 속한 팀 ID를 가져옵니다.
 * 백엔드 API를 통해 실제 팀 멤버십을 확인합니다.
 */
export async function getUserTeamId(): Promise<string | null> {
	try {
		// 백엔드 API를 통해 현재 사용자의 팀 정보 조회
		const userTeam = await teamsApi.getMyTeam();

		if (!userTeam) {
			// 팀이 없으면 localStorage에서도 제거
			localStorage.removeItem("teamId");
			return null;
		}

		// 팀이 있으면 localStorage에 저장 (캐싱)
		localStorage.setItem("teamId", userTeam.teamId);
		return userTeam.teamId;
	} catch {
		// 에러 발생 시 localStorage에서 제거
		localStorage.removeItem("teamId");
		return null;
	}
}
