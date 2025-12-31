'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import { usersApi } from '@/lib/api/users.api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

