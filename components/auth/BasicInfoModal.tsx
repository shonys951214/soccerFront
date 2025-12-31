'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import { usersApi } from '@/lib/api/users.api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import Button from '@/components/common/Button';
import Image from 'next/image';

const DEFAULT_PROFILE_IMAGE = '/profile_default_image.png';

interface BasicInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BasicInfoModal({
  isOpen,
  onClose,
}: BasicInfoModalProps) {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [birthdate, setBirthdate] = useState('');
  const [phone, setPhone] = useState('');
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

    if (!birthdate) {
      setError('생년월일을 입력해주세요.');
      return;
    }

    if (!phone.trim()) {
      setError('연락처를 입력해주세요.');
      return;
    }

    // 연락처 형식 검증 (010-XXXX-XXXX)
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone.trim())) {
      setError('연락처 형식이 올바르지 않습니다. (010-0000-0000)');
      return;
    }

    setIsLoading(true);
    try {
      // 프로필 생성 (이름은 회원가입 시 받았으므로 user.name 사용)
      await usersApi.createProfile({
        name: user?.name || '',
        birthdate: birthdate,
        phone: phone.trim(),
        positions: [], // 기본정보 입력 시에는 포지션 제외
        summary: undefined,
      });
      
      // 프로필 사진이 선택된 경우 업로드
      if (profileImage) {
        try {
          await usersApi.uploadProfileImage(profileImage);
        } catch (uploadError: unknown) {
          console.error('프로필 사진 업로드 실패:', uploadError);
          // 업로드 실패해도 프로필 생성은 성공한 상태이므로 계속 진행
        }
      }
      
      // 사용자 정보 새로고침
      if (refreshUser) {
        await refreshUser();
      }
      
      onClose();
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || '등록에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // 닫기 비활성화 (필수 등록)
      title="기본 정보 입력"
      size="md"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          서비스를 이용하기 위해 기본 정보를 입력해주세요.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              value={user?.name || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">회원가입 시 입력한 이름입니다.</p>
          </div>

          {/* 프로필 사진 선택 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              프로필 사진 (선택)
            </label>
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="프로필 미리보기"
                    width={96}
                    height={96}
                    className="rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <Image
                    src={DEFAULT_PROFILE_IMAGE}
                    alt="기본 프로필"
                    width={96}
                    height={96}
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
                    id="basic-info-profile-image-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    className="text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('basic-info-profile-image-input')?.click();
                    }}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              생년월일 *
            </label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연락처 *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9-]/g, '');
                // 자동으로 하이픈 추가
                let formatted = value.replace(/-/g, '');
                if (formatted.length > 3 && formatted.length <= 7) {
                  formatted = formatted.slice(0, 3) + '-' + formatted.slice(3);
                } else if (formatted.length > 7) {
                  formatted = formatted.slice(0, 3) + '-' + formatted.slice(3, 7) + '-' + formatted.slice(7, 11);
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

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '등록 중...' : '등록하기'}
          </button>
        </form>
      </div>
    </Modal>
  );
}

