'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import ProfileForm from './ProfileForm';
import { usersApi } from '@/lib/api/users.api';
import { useRouter } from 'next/navigation';
import { CreateProfileRequest } from '@/lib/types/user.types';

interface ProfileRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileRegistrationModal({
  isOpen,
  onClose,
}: ProfileRegistrationModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateProfileRequest) => {
    setIsLoading(true);
    try {
      await usersApi.createProfile(data);
      onClose();
      // 프로필 등록 후 대시보드로 이동하거나 새로고침
      router.refresh();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // 닫기 비활성화 (필수 등록)
      title="회원 정보 등록"
      size="md"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          서비스를 이용하기 위해 회원 정보를 등록해주세요.
        </p>
        <ProfileForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </Modal>
  );
}

