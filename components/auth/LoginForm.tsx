"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { usersApi } from "@/lib/api/users.api";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

export default function LoginForm() {
	const router = useRouter();
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			await login(email, password);
			
			// 프로필 확인 후 리다이렉트
			try {
				await usersApi.getProfile();
				// 프로필이 있으면 대시보드로
				router.push("/dashboard");
			} catch (profileError: any) {
				// 프로필이 없으면 (404) 프로필 설정 페이지로
				if (profileError.response?.status === 404) {
					router.push("/profile/setup");
				} else {
					// 다른 에러면 대시보드로 (프로필 확인 실패는 치명적이지 않음)
					router.push("/dashboard");
				}
			}
		} catch (err: any) {
			setError(err.response?.data?.message || "로그인에 실패했습니다.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
			<div className="space-y-4">
				<Input type="email" label="이메일" placeholder="이메일을 입력하세요" value={email} onChange={(e) => setEmail(e.target.value)} required />
				<Input type="password" label="비밀번호" placeholder="비밀번호를 입력하세요" value={password} onChange={(e) => setPassword(e.target.value)} required />
			</div>

			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<input
						id="remember-me"
						name="remember-me"
						type="checkbox"
						checked={rememberMe}
						onChange={(e) => setRememberMe(e.target.checked)}
						className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
					/>
					<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
						로그인 상태 유지
					</label>
				</div>

				<div className="text-sm">
					<a href="/find-password" className="font-medium text-blue-600 hover:text-blue-500">
						아이디·비밀번호 찾기
					</a>
				</div>
			</div>

			{error && <div className="text-red-600 text-sm text-center">{error}</div>}

			<Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
				로그인
			</Button>

			{/* 카카오 로그인 버튼 (추후 구현) */}
			<div className="mt-2">
				<Button
					type="button"
					variant="outline"
					size="lg"
					className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
					onClick={() => {
						// TODO: 카카오 로그인 구현
						alert("카카오 로그인은 추후 구현 예정입니다.");
					}}
				>
					카카오 로그인
				</Button>
			</div>

			<div className="text-center mt-4">
				<a href="/signup" className="text-sm text-blue-600 hover:text-blue-500">
					회원가입
				</a>
			</div>
		</form>
	);
}
