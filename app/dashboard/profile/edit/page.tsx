'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usersApi } from '@/lib/api/users.api';
import { useAuth } from '@/components/providers/AuthProvider';
import { UserProfile, UpdateProfileRequest, Position } from '@/lib/types/user.types';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import PositionSelector from '@/components/auth/PositionSelector';

export default function EditProfilePage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    name: '',
    birthdate: '',
    phone: '',
    positions: [],
    summary: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await usersApi.getProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        birthdate: data.birthdate || '',
        phone: data.phone || '',
        positions: data.positions || [],
        summary: data.summary || '',
      });
    } catch (err: any) {
      setError('프로필 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await usersApi.updateProfile(formData);
      await refreshUser(); // 사용자 정보 새로고침
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || '프로필 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading size="lg" className="py-12" />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">프로필 수정</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Input
          type="text"
          label="이름 *"
          placeholder="이름을 입력하세요"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          type="date"
          label="생년월일"
          value={formData.birthdate}
          onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
        />

        <Input
          type="tel"
          label="연락처"
          placeholder="010-0000-0000"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            포지션 * (다중 선택 가능)
          </label>
          <PositionSelector
            selectedPositions={formData.positions || []}
            onChange={(positions) => setFormData({ ...formData, positions })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            소개
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="자기소개를 입력하세요"
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
            disabled={isSaving}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            className="flex-1"
          >
            수정하기
          </Button>
        </div>
      </form>
    </div>
  );
}

