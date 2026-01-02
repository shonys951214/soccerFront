import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usersApi } from '@/lib/api/users.api';
import { validatePassword, validatePasswordMatch } from '@/lib/utils/validation';
import { getErrorMessage } from '@/lib/utils/error';

export function usePasswordChange() {
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
    const passwordMatchValidation = validatePasswordMatch(
      formData.newPassword,
      formData.confirmPassword
    );
    if (!passwordMatchValidation.isValid) {
      setError(passwordMatchValidation.message || '비밀번호 확인에 실패했습니다.');
      return;
    }

    // 비밀번호 길이 검증
    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message || '비밀번호 검증에 실패했습니다.');
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
    } catch (err) {
      setError(getErrorMessage(err, '비밀번호 변경에 실패했습니다.'));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    setFormData,
    isSaving,
    error,
    success,
    handleSubmit,
  };
}

