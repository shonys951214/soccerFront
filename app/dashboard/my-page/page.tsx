"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { teamsApi } from "@/lib/api/teams.api";
import { usersApi } from "@/lib/api/users.api";
import { UserProfile } from "@/lib/types/user.types";
import { UserTeam } from "@/lib/types/team.types";
import { useTeamId } from "@/lib/hooks/useTeamId";
import Button from "@/components/common/Button";
import Loading from "@/components/common/Loading";

export default function MyPagePage() {
	const router = useRouter();
	const { user, refreshUser } = useAuth();
	const { teamId } = useTeamId();
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [userTeam, setUserTeam] = useState<UserTeam | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isUploading, setIsUploading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [profileData, teamData] = await Promise.all([usersApi.getProfile(), teamsApi.getMyTeam()]);
				setProfile(profileData);
				setUserTeam(teamData);
			} catch (error) {
				console.error("Failed to fetch data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (teamId) {
			fetchData();
		}
	}, [teamId]);

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// 이미지 파일 검증
		if (!file.type.startsWith("image/")) {
			alert("이미지 파일만 업로드 가능합니다.");
			return;
		}

		// 파일 크기 검증 (5MB 제한)
		if (file.size > 5 * 1024 * 1024) {
			alert("파일 크기는 5MB 이하여야 합니다.");
			return;
		}

		setIsUploading(true);
		try {
			await usersApi.uploadProfileImage(file);
			// 프로필 정보 새로고침
			const updatedProfile = await usersApi.getProfile();
			setProfile(updatedProfile);
			// AuthProvider의 user 정보도 새로고침
			await refreshUser();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error && "response" in error ? (error as { response?: { data?: { message?: string } } }).response?.data?.message : "프로필 사진 업로드에 실패했습니다.";
			alert(errorMessage || "프로필 사진 업로드에 실패했습니다.");
		} finally {
			setIsUploading(false);
			// input 초기화
			e.target.value = "";
		}
	};

	if (isLoading) {
		return <Loading size="lg" className="py-12" />;
	}

	return (
		<div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-0">
			<h1 className="text-xl sm:text-2xl font-bold text-gray-900">마이페이지</h1>

			{/* 프로필 사진 + 팀 정보 */}
			<div className="bg-white rounded-lg shadow p-4 sm:p-6">
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
					{/* 프로필 사진 */}
					<div className="flex flex-col items-center space-y-3">
						<div className="relative">
							<img
								src={profile?.profileImage || "/profile_default_image.png"}
								alt={profile?.name || user?.name || "프로필"}
								className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
							/>
							{isUploading && (
								<div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
									<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
								</div>
							)}
						</div>
						<label className="cursor-pointer">
							<input type="file" accept="image/*" onChange={handleImageChange} disabled={isUploading} className="hidden" id="profile-image-input" />
							<Button
								variant="outline"
								size="sm"
								disabled={isUploading}
								className="text-xs sm:text-sm"
								onClick={(e) => {
									e.preventDefault();
									document.getElementById("profile-image-input")?.click();
								}}
							>
								{isUploading ? "업로드 중..." : "사진 변경"}
							</Button>
						</label>
					</div>

					{/* 팀 정보 */}
					{userTeam && (
						<div className="flex-1">
							<h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">내 소속팀</h2>
							<div className="space-y-2">
								<div className="flex justify-between">
									<span className="text-gray-600">팀명</span>
									<span className="font-medium">{userTeam.teamName}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">역할</span>
									<span className="font-medium">{userTeam.role === "captain" ? "팀장" : userTeam.role === "vice_captain" ? "부팀장" : "팀원"}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">상태</span>
									<span className="font-medium">
										{userTeam.status === "active" ? "활동" : userTeam.status === "injured" ? "부상" : userTeam.status === "long_term_absence" ? "장기 출전 불가" : "단기 출전 불가"}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* 프로필 정보 + 소개글 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
				{/* 프로필 정보 */}
				<div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
					<h2 className="text-base sm:text-lg font-semibold text-gray-800">프로필 정보</h2>
					<div className="space-y-2">
						<div className="flex justify-between">
							<span className="text-gray-600">이름</span>
							<span className="font-medium">{profile?.name || "-"}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">이메일</span>
							<span className="font-medium">{profile?.email || "-"}</span>
						</div>
						{profile?.phone && (
							<div className="flex justify-between">
								<span className="text-gray-600">연락처</span>
								<span className="font-medium">{profile.phone}</span>
							</div>
						)}
						{profile?.birthdate && (
							<div className="flex justify-between">
								<span className="text-gray-600">생년월일</span>
								<span className="font-medium">{new Date(profile.birthdate).toLocaleDateString("ko-KR")}</span>
							</div>
						)}
						{profile?.positions && profile.positions.length > 0 && (
							<div className="flex justify-between">
								<span className="text-gray-600">포지션</span>
								<span className="font-medium">{profile.positions.join(", ")}</span>
							</div>
						)}
					</div>
				</div>

				{/* 소개글 */}
				{profile?.summary && (
					<div className="bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col">
						<h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">소개</h2>
						<div className="flex-1">
							<p className="text-sm text-gray-700 line-clamp-10 break-words whitespace-pre-wrap">{profile.summary}</p>
						</div>
					</div>
				)}
			</div>

			{/* 계정 설정 */}
			<div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
				<h2 className="text-base sm:text-lg font-semibold text-gray-800">계정 설정</h2>
				<div className="flex flex-col sm:flex-row gap-3">
					<Button variant="outline" size="md" className="flex-1" onClick={() => router.push("/dashboard/profile/edit")}>
						프로필 수정
					</Button>
					<Button variant="outline" size="md" className="flex-1" onClick={() => router.push("/dashboard/profile/password")}>
						비밀번호 변경
					</Button>
				</div>
			</div>
		</div>
	);
}
