'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { usersApi } from '@/lib/api/users.api';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

const DEFAULT_PROFILE_IMAGE = '/profile_default_image.png';

export default function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
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
    setError('');

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 길이 확인
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, password, name);
      
      // 프로필 사진이 선택된 경우 업로드
      if (profileImage) {
        try {
          await usersApi.uploadProfileImage(profileImage);
        } catch (uploadError: unknown) {
          console.error('프로필 사진 업로드 실패:', uploadError);
          // 업로드 실패해도 회원가입은 성공한 상태이므로 계속 진행
        }
      }
      
      router.push('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : '회원가입에 실패했습니다.';
      setError(errorMessage || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          type="email"
          label="이메일"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="text"
          label="이름"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요 (6자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        
        {/* 프로필 사진 선택 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            프로필 사진 (선택)
          </label>
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="프로필 미리보기"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <img
                  src={DEFAULT_PROFILE_IMAGE}
                  alt="기본 프로필"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
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
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="text-xs"
                >
                  사진 선택
                </Button>
              </label>
              {previewImage && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSkipImage}
                  disabled={isLoading}
                  className="text-xs"
                >
                  건너뛰기
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 text-center">
              선택하지 않으면 기본 프로필 사진이 사용됩니다
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center">{error}</div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full"
      >
        가입하기
      </Button>

      <div className="text-center">
        <a href="/login" className="text-sm text-blue-600 hover:text-blue-500">
          이미 계정이 있으신가요? 로그인
        </a>
      </div>

      {/* 카카오 로그인 버튼 (추후 구현) */}
      <div className="mt-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
          onClick={() => {
            // TODO: 카카오 로그인 구현
            alert('카카오 로그인은 추후 구현 예정입니다.');
          }}
        >
          카카오 로그인
        </Button>
      </div>
    </form>
  );
}

