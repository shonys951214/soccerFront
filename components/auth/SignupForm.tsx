"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

export default function SignupForm() {
	const router = useRouter();
	const { signup } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// 비밀번호 확인
		if (password !== confirmPassword) {
			setError("비밀번호가 일치하지 않습니다.");
			return;
		}

		// 비밀번호 길이 확인
		if (password.length < 6) {
			setError("비밀번호는 6자 이상이어야 합니다.");
			return;
		}

		setIsLoading(true);

		try {
			await signup(email, password, name);
			// 회원가입 후 프로필 설정 페이지로 리다이렉트
			router.push("/profile/setup");
		} catch (err: unknown) {
			const errorMessage = err && typeof err === "object" && "response" in err ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : "회원가입에 실패했습니다.";
			setError(errorMessage || "회원가입에 실패했습니다.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
			<div className="space-y-4">
				<Input type="email" label="이메일" placeholder="이메일을 입력하세요" value={email} onChange={(e) => setEmail(e.target.value)} required />
				<Input type="text" label="이름" placeholder="이름을 입력하세요" value={name} onChange={(e) => setName(e.target.value)} required />
				<Input type="password" label="비밀번호" placeholder="비밀번호를 입력하세요 (6자 이상)" value={password} onChange={(e) => setPassword(e.target.value)} required />
				<Input type="password" label="비밀번호 확인" placeholder="비밀번호를 다시 입력하세요" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
			</div>

			{error && <div className="text-red-600 text-sm text-center">{error}</div>}

			<Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
				가입하기
			</Button>

			{/* 카카오 로그인 버튼 (추후 구현) */}
			<div className="mt-4">
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
				<a href="/login" className="text-sm text-blue-600 hover:text-blue-500">
					이미 계정이 있으신가요? 로그인
				</a>
			</div>
		</form>
	);
}
