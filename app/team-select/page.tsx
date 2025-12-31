"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import TeamSelectCard from "@/components/team/TeamSelectCard";
import CreateTeamForm from "@/components/team/CreateTeamForm";
import JoinTeamList from "@/components/team/JoinTeamList";
import { teamsApi } from "@/lib/api/teams.api";
import { usersApi } from "@/lib/api/users.api";
import Loading from "@/components/common/Loading";

type ViewMode = "select" | "create" | "join";

export default function TeamSelectPage() {
	const router = useRouter();
	const { user, isAuthenticated, isLoading: authLoading } = useAuth();
	const [viewMode, setViewMode] = useState<ViewMode>("select");
	const [isLoading, setIsLoading] = useState(false);
	const [checkingProfile, setCheckingProfile] = useState(true);

	const handleCreateTeam = async (name: string) => {
		setIsLoading(true);
		try {
			const team = await teamsApi.createTeam({ name });
			// 팀 생성 후 팀 ID를 localStorage에 저장 (캐싱)
			localStorage.setItem("teamId", team.id);
			router.push("/dashboard");
		} catch (error) {
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const handleJoinTeam = async (teamId: string) => {
		setIsLoading(true);
		try {
			await teamsApi.joinTeam(teamId);
			// 팀 가입 후 팀 ID를 localStorage에 저장 (캐싱)
			localStorage.setItem("teamId", teamId);
			router.push("/dashboard");
		} catch (error) {
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// 프로필 확인 및 리다이렉트
	useEffect(() => {
		const checkProfile = async () => {
			if (!authLoading && isAuthenticated) {
				try {
					// 프로필 정보 확인
					await usersApi.getProfile();
					// 프로필이 있으면 정상 진행
				} catch (error: any) {
					// 프로필이 없으면 프로필 설정 페이지로 리다이렉트
					if (error.response?.status === 404) {
						router.push("/profile/setup");
						return;
					}
				} finally {
					setCheckingProfile(false);
				}
			} else if (!authLoading && !isAuthenticated) {
				// 인증되지 않았으면 로그인 페이지로
				localStorage.removeItem("token");
				localStorage.removeItem("teamId");
				router.push("/login");
			}
		};

		checkProfile();
	}, [authLoading, isAuthenticated, router]);

	// 로딩 중이거나 프로필 확인 중일 때
	if (authLoading || checkingProfile) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<Loading size="lg" />
			</div>
		);
	}

	if (viewMode === "select") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
				<div className="max-w-2xl w-full space-y-6 sm:space-y-8">
					<div className="text-center">
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">클럽 선택</h1>
						<p className="text-sm sm:text-base text-gray-600">새 클럽을 만들거나 기존 클럽에 가입하세요.</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
						<TeamSelectCard title="클럽 생성" description="새로운 클럽을 만들어 팀을 시작하세요" icon="⚽" onClick={() => setViewMode("create")} />
						<TeamSelectCard title="클럽 가입" description="기존 클럽에 가입하여 함께하세요" icon="👥" onClick={() => setViewMode("join")} />
					</div>
				</div>
			</div>
		);
	}

	if (viewMode === "create") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
				<div className="max-w-md w-full bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg">
					<h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">클럽 생성</h2>
					<CreateTeamForm onSubmit={handleCreateTeam} onCancel={() => setViewMode("select")} isLoading={isLoading} />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<div className="max-w-md w-full bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg">
				<div className="flex items-center justify-between mb-4 sm:mb-6">
					<h2 className="text-xl sm:text-2xl font-bold text-gray-900">클럽 가입</h2>
					<button onClick={() => setViewMode("select")} className="text-gray-500 hover:text-gray-700">
						← 돌아가기
					</button>
				</div>
				<JoinTeamList onJoin={handleJoinTeam} isLoading={isLoading} />
			</div>
		</div>
	);
}
