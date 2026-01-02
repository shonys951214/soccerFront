'use client';

import { useRouter } from 'next/navigation';
import { usePasswordChange } from '@/lib/hooks/usePasswordChange';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function ChangePasswordPage() {
  const router = useRouter();
  const {
    formData,
    setFormData,
    isSaving,
    error,
    success,
    handleSubmit,
  } = usePasswordChange();

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">비밀번호 변경</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
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

