import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { teamsApi } from '@/lib/api/teams.api';
import { getErrorMessage } from '@/lib/utils/error';

export function useTeamActions(teamId: string | null) {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leaveConfirmText, setLeaveConfirmText] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [leaveErrorMessage, setLeaveErrorMessage] = useState('');
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [uploadErrorMessage, setUploadErrorMessage] = useState('');

  const handleLeaveTeam = () => {
    setShowLeaveModal(true);
    setLeaveConfirmText('');
    setLeaveErrorMessage('');
  };

  const handleConfirmLeave = async () => {
    if (!teamId) return;
    
    if (leaveConfirmText.trim() !== '탈퇴') {
      setLeaveErrorMessage('"탈퇴"를 정확히 입력해주세요.');
      return;
    }
    
    setIsLeaving(true);
    try {
      await teamsApi.leaveTeam(teamId);
      localStorage.removeItem('teamId');
      setShowLeaveModal(false);
      router.push('/team-select');
    } catch (err) {
      const errorMsg = getErrorMessage(err, '팀 탈퇴에 실패했습니다.');
      setLeaveErrorMessage(errorMsg);
    } finally {
      setIsLeaving(false);
    }
  };

  const handleDeleteTeam = () => {
    setShowDeleteModal(true);
    setDeleteConfirmText('');
    setDeleteErrorMessage('');
  };

  const handleConfirmDelete = async () => {
    if (!teamId) return;
    
    if (deleteConfirmText.trim() !== '삭제') {
      setDeleteErrorMessage('"삭제"를 정확히 입력해주세요.');
      return;
    }
    
    setIsDeleting(true);
    try {
      await teamsApi.deleteTeam(teamId);
      localStorage.removeItem('teamId');
      setShowDeleteModal(false);
      router.push('/team-select');
    } catch (err) {
      const errorMsg = getErrorMessage(err, '팀 삭제에 실패했습니다.');
      setDeleteErrorMessage(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess?: () => void
  ) => {
    const file = e.target.files?.[0];
    if (!file || !teamId) return;

    const { validateImageFile } = await import('@/lib/utils/validation');
    const validation = validateImageFile(file);
    
    if (!validation.isValid) {
      setUploadErrorMessage(validation.message || '이미지 업로드에 실패했습니다.');
      setTimeout(() => setUploadErrorMessage(''), 3000);
      return;
    }

    setIsUploadingLogo(true);
    try {
      await teamsApi.uploadTeamLogo(teamId, file);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMsg = getErrorMessage(err, '팀 로고 업로드에 실패했습니다.');
      setUploadErrorMessage(errorMsg);
      setTimeout(() => setUploadErrorMessage(''), 3000);
    } finally {
      setIsUploadingLogo(false);
      e.target.value = '';
    }
  };

  return {
    isLeaving,
    isDeleting,
    isUploadingLogo,
    showLeaveModal,
    showDeleteModal,
    leaveConfirmText,
    deleteConfirmText,
    leaveErrorMessage,
    deleteErrorMessage,
    uploadErrorMessage,
    setShowLeaveModal,
    setShowDeleteModal,
    setLeaveConfirmText,
    setDeleteConfirmText,
    handleLeaveTeam,
    handleConfirmLeave,
    handleDeleteTeam,
    handleConfirmDelete,
    handleLogoChange,
  };
}

