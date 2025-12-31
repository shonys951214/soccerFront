"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import Header from "@/components/layout/Header";
import TabNavigation from "@/components/layout/TabNavigation";
import { useTeamId } from "@/lib/hooks/useTeamId";
import Loading from "@/components/common/Loading";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { isAuthenticated, isLoading: authLoading } = useAuth();
	const { teamId, isLoading: teamIdLoading } = useTeamId();

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			// 인증되지 않았으면 로그인 페이지로
			localStorage.removeItem("token");
			localStorage.removeItem("teamId");
			router.push("/login");
		}
	}, [authLoading, isAuthenticated, router]);

	if (authLoading || teamIdLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loading size="lg" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />
			<TabNavigation />
			<main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">{children}</main>
		</div>
	);
}
