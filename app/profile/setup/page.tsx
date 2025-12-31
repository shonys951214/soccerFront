"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { usersApi } from "@/lib/api/users.api";
import { Position } from "@/lib/types/user.types";
import Input from "@/components/common/Input";
import PositionSelector from "@/components/auth/PositionSelector";
import Button from "@/components/common/Button";
import Image from "next/image";
import Loading from "@/components/common/Loading";

const DEFAULT_PROFILE_IMAGE = "/profile_default_image.png";

export default function ProfileSetupPage() {
	const router = useRouter();
	const { user, refreshUser, isAuthenticated, isLoading: authLoading } = useAuth();
	const [birthdate, setBirthdate] = useState("");
	const [phone, setPhone] = useState("");
	const [positions, setPositions] = useState<Position[]>([]);
	const [summary, setSummary] = useState("");
	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [checkingProfile, setCheckingProfile] = useState(true);

	// 인증 확인 (프로필은 첫 회원가입 유저는 없으므로 확인 불필요)
	useEffect(() => {
		const checkAuth = async () => {
			// 인증 로딩이 완료될 때까지 대기
			if (authLoading) {
				return;
			}

			// 토큰 확인
			const token = localStorage.getItem("token");
			if (!token) {
				// 토큰이 없으면 로그인 페이지로
				localStorage.removeItem("teamId");
				router.push("/login");
				return;
			}

			// 토큰이 있으면 프로필 설정 페이지 표시 (첫 회원가입 유저는 프로필이 없음)
			setCheckingProfile(false);
		};

		checkAuth();
	}, [authLoading, router]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

		setProfileImage(file);
		// 미리보기 생성
		const reader = new FileReader();
		reader.onloadend = () => {
			setPreviewImage(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleSkipImage = () => {
		setProfileImage(null);
		setPreviewImage(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!birthdate) {
			setError("생년월일을 입력해주세요.");
			return;
		}

		if (!phone.trim()) {
			setError("연락처를 입력해주세요.");
			return;
		}

		// 연락처 형식 검증 (010-XXXX-XXXX)
		const phoneRegex = /^010-\d{4}-\d{4}$/;
		if (!phoneRegex.test(phone.trim())) {
			setError("연락처 형식이 올바르지 않습니다. (010-0000-0000)");
			return;
		}

		if (positions.length === 0) {
			setError("최소 1개 이상의 포지션을 선택해주세요.");
			return;
		}

		setIsLoading(true);
		try {
			// 프로필 생성
			await usersApi.createProfile({
				name: user?.name || "",
				birthdate: birthdate,
				phone: phone.trim(),
				positions: positions,
				summary: summary.trim() || undefined,
			});

			// 프로필 사진이 선택된 경우 업로드
			if (profileImage) {
				try {
					await usersApi.uploadProfileImage(profileImage);
				} catch (uploadError: unknown) {
					console.error("프로필 사진 업로드 실패:", uploadError);
					// 업로드 실패해도 프로필 생성은 성공한 상태이므로 계속 진행
				}
			}

			// 사용자 정보 새로고침
			if (refreshUser) {
				await refreshUser();
			}

			// 클럽 선택 페이지로 이동
			router.push("/team-select");
		} catch (err: any) {
			setError(err.response?.data?.message || "등록에 실패했습니다.");
		} finally {
			setIsLoading(false);
		}
	};

	// 로딩 중이거나 프로필 확인 중일 때
	if (authLoading || checkingProfile) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<Loading size="lg" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
			<div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6 sm:p-8">
				<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">기본 회원정보를 작성해주세요</h1>
				<p className="text-sm sm:text-base text-gray-600 mb-6">서비스를 이용하기 위해 필요한 정보를 입력해주세요.</p>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* 이름 (읽기 전용) */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
						<input
							type="text"
							value={user?.name || ""}
							disabled
							className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
						/>
						<p className="mt-1 text-xs text-gray-500">회원가입 시 입력한 이름입니다.</p>
					</div>

					{/* 프로필 사진 선택 */}
					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">프로필 사진 (선택)</label>
						<div className="flex flex-col items-center space-y-3">
							<div className="relative">
								{previewImage ? (
									<Image
										src={previewImage}
										alt="프로필 미리보기"
										width={120}
										height={120}
										className="rounded-full object-cover border-2 border-gray-200"
									/>
								) : (
									<Image
										src={DEFAULT_PROFILE_IMAGE}
										alt="기본 프로필"
										width={120}
										height={120}
										className="rounded-full object-cover border-2 border-gray-200"
									/>
								)}
							</div>
							<div className="flex gap-2">
								<label className="cursor-pointer">
									<input
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										disabled={isLoading}
										className="hidden"
										id="profile-setup-image-input"
									/>
									<Button
										type="button"
										variant="outline"
										size="sm"
										disabled={isLoading}
										onClick={(e) => {
											e.preventDefault();
											document.getElementById("profile-setup-image-input")?.click();
										}}
									>
										사진 선택
									</Button>
								</label>
								{previewImage && (
									<Button type="button" variant="outline" size="sm" onClick={handleSkipImage} disabled={isLoading}>
										건너뛰기
									</Button>
								)}
							</div>
							<p className="text-xs text-gray-500 text-center">선택하지 않으면 기본 프로필 사진이 사용됩니다</p>
						</div>
					</div>

					{/* 생년월일 */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							생년월일 <span className="text-red-500">*</span>
						</label>
						<input
							type="date"
							value={birthdate}
							onChange={(e) => setBirthdate(e.target.value)}
							required
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
						/>
					</div>

					{/* 연락처 */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							연락처 <span className="text-red-500">*</span>
						</label>
						<input
							type="tel"
							value={phone}
							onChange={(e) => {
								const value = e.target.value.replace(/[^0-9-]/g, "");
								// 자동으로 하이픈 추가
								let formatted = value.replace(/-/g, "");
								if (formatted.length > 3 && formatted.length <= 7) {
									formatted = formatted.slice(0, 3) + "-" + formatted.slice(3);
								} else if (formatted.length > 7) {
									formatted = formatted.slice(0, 3) + "-" + formatted.slice(3, 7) + "-" + formatted.slice(7, 11);
								}
								setPhone(formatted);
							}}
							placeholder="010-0000-0000"
							required
							maxLength={13}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
						/>
						<p className="mt-1 text-xs text-gray-500">형식: 010-0000-0000</p>
					</div>

					{/* 포지션 */}
					<PositionSelector selectedPositions={positions} onChange={setPositions} label="포지션 (다중 선택 가능)" required />

					{/* 소개 */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">소개 (선택)</label>
						<textarea
							value={summary}
							onChange={(e) => setSummary(e.target.value)}
							placeholder="자기소개나 선수 설명을 입력하세요"
							rows={4}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
						/>
					</div>

					{error && <div className="text-red-600 text-sm">{error}</div>}

					<Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
						등록하기
					</Button>
				</form>
			</div>
		</div>
	);
}

