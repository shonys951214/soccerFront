"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import TeamSelectCard from "@/components/team/TeamSelectCard";
import CreateTeamForm from "@/components/team/CreateTeamForm";
import JoinTeamList from "@/components/team/JoinTeamList";
import PendingJoinRequestBanner from "@/components/team/PendingJoinRequestBanner";
import Header from "@/components/layout/Header";
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
	const [checkingTeam, setCheckingTeam] = useState(true);
	const [refreshKey, setRefreshKey] = useState(0); // Banner 새로고침용

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
			await teamsApi.createJoinRequest(teamId);
			// 가입신청 완료 후 알림
			alert("가입신청이 완료되었습니다. 팀장의 승인을 기다려주세요.");
			// 대시보드로 이동하지 않고 team-select 페이지에 머무름
			setViewMode("select");
			// Banner 새로고침
			setRefreshKey(prev => prev + 1);
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || "가입신청에 실패했습니다.";
			alert(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	// 프로필 확인 및 팀 확인
	useEffect(() => {
		const checkProfileAndTeam = async () => {
			if (!authLoading && isAuthenticated) {
				try {
					// 프로필 정보 확인
					await usersApi.getProfile();
					
					// 팀 소속 여부 확인
					try {
						const userTeam = await teamsApi.getMyTeam();
						// 팀이 있으면 대시보드로 리다이렉트
						if (userTeam && userTeam.teamId) {
							router.push("/dashboard");
							return;
						}
					} catch (teamError: any) {
						// 팀이 없으면 (404 또는 null) 정상 진행
						// 404가 아닌 다른 에러는 무시하지 않음
						if (teamError.response?.status !== 404) {
							console.error('Failed to check team:', teamError);
						}
					}
					// 프로필이 있고 팀이 없으면 정상 진행
				} catch (error: any) {
					// 프로필이 없으면 프로필 설정 페이지로 리다이렉트
					if (error.response?.status === 404) {
						router.push("/profile/setup");
						return;
					}
				} finally {
					setCheckingProfile(false);
					setCheckingTeam(false);
				}
			} else if (!authLoading && !isAuthenticated) {
				// 인증되지 않았으면 로그인 페이지로
				localStorage.removeItem("token");
				localStorage.removeItem("teamId");
				router.push("/login");
			}
		};

		checkProfileAndTeam();
	}, [authLoading, isAuthenticated, router]);

	// 로딩 중이거나 프로필/팀 확인 중일 때
	if (authLoading || checkingProfile || checkingTeam) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<Loading size="lg" />
			</div>
		);
	}

	if (viewMode === "select") {
		return (
			<div className="min-h-screen bg-gray-50">
				<Header />
				<div className="flex items-center justify-center px-4 py-8 sm:py-12">
					<div className="max-w-2xl w-full space-y-6 sm:space-y-8">
						<div className="text-center">
							<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">클럽 선택</h1>
							<p className="text-sm sm:text-base text-gray-600">새 클럽을 만들거나 기존 클럽에 가입하세요.</p>
						</div>

						{/* 가입신청 대기 중인 팀 표시 */}
						<PendingJoinRequestBanner key={refreshKey} />

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
							<TeamSelectCard title="클럽 생성" description="새로운 클럽을 만들어 팀을 시작하세요" icon="⚽" onClick={() => setViewMode("create")} />
							<TeamSelectCard title="클럽 가입신청" description="기존 클럽에 가입신청을 보내세요" icon="👥" onClick={() => setViewMode("join")} />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (viewMode === "create") {
		return (
			<div className="min-h-screen bg-gray-50">
				<Header />
				<div className="flex items-center justify-center px-4 py-8 sm:py-12">
					<div className="max-w-md w-full bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg">
						<h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">클럽 생성</h2>
						<CreateTeamForm onSubmit={handleCreateTeam} onCancel={() => setViewMode("select")} isLoading={isLoading} />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />
			<div className="flex items-center justify-center px-4 py-8 sm:py-12">
				<div className="max-w-md w-full bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg">
					<div className="flex items-center justify-between mb-4 sm:mb-6">
						<h2 className="text-xl sm:text-2xl font-bold text-gray-900">클럽 가입신청</h2>
						<button onClick={() => setViewMode("select")} className="text-gray-500 hover:text-gray-700">
							← 돌아가기
						</button>
					</div>
					<JoinTeamList onJoin={handleJoinTeam} isLoading={isLoading} />
				</div>
			</div>
		</div>
	);
}
