'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usersApi } from '@/lib/api/users.api';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // 비밀번호 확인 검증
    if (formData.newPassword !== formData.confirmPassword) {
      setError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    // 비밀번호 길이 검증
    if (formData.newPassword.length < 6) {
      setError('새 비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setIsSaving(true);

    try {
      await usersApi.changePassword(formData.currentPassword, formData.newPassword);
      setSuccess(true);
      // 2초 후 대시보드로 이동
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">비밀번호 변경</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            비밀번호가 성공적으로 변경되었습니다. 잠시 후 대시보드로 이동합니다.
          </div>
        )}

        <Input
          type="password"
          label="현재 비밀번호 *"
          placeholder="현재 비밀번호를 입력하세요"
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          required
        />

        <Input
          type="password"
          label="새 비밀번호 *"
          placeholder="새 비밀번호를 입력하세요 (최소 6자)"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          required
          minLength={6}
        />

        <Input
          type="password"
          label="비밀번호 확인 *"
          placeholder="새 비밀번호를 다시 입력하세요"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
          minLength={6}
        />

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
            disabled={success}
          >
            변경하기
          </Button>
        </div>
      </form>
    </div>
  );
}

