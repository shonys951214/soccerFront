"use client";

import { useParams } from "next/navigation";
import MatchDetail from "@/components/matches/MatchDetail";
import { useTeamId } from "@/lib/hooks/useTeamId";
import TeamRequiredWrapper from "@/components/common/TeamRequiredWrapper";
import BackLink from "@/components/common/BackLink";

export default function MatchDetailPage() {
	const params = useParams();
	const matchId = params.id as string;
	const { teamId } = useTeamId();

	return (
		<TeamRequiredWrapper>
			<BackLink href="/dashboard/matches" label="← 경기 목록으로" />
			{teamId && <MatchDetail matchId={matchId} teamId={teamId} canEdit={true} />}
		</TeamRequiredWrapper>
	);
}
