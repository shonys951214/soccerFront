import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usersApi } from '@/lib/api/users.api';
import { useAuth } from '@/components/providers/AuthProvider';
import { UserProfile, UpdateProfileRequest, Position } from '@/lib/types/user.types';
import { getErrorMessage } from '@/lib/utils/error';

export function useProfileForm() {
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
    setError('');
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
    } catch (err) {
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
      await refreshUser();
      router.push('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, '프로필 수정에 실패했습니다.'));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    profile,
    formData,
    setFormData,
    isLoading,
    isSaving,
    error,
    handleSubmit,
  };
}

