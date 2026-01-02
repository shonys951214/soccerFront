'use client';

import { useTeamId } from '@/lib/hooks/useTeamId';
import { useTeamData } from '@/lib/hooks/useTeamData';
import { useTeamActions } from '@/lib/hooks/useTeamActions';
import TeamRequiredWrapper from '@/components/common/TeamRequiredWrapper';
import PageLayout from '@/components/common/PageLayout';
import TeamInfoCard from '@/components/team/TeamInfoCard';
import TeamModals from '@/components/team/TeamModals';

export default function MyTeamPage() {
  const { teamId } = useTeamId();
  const { team, userTeam, isLoading, error, refreshTeam } = useTeamData(teamId);
  const {
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
  } = useTeamActions(teamId);

  if (isLoading) {
    return <PageLayout isLoading={true} />;
  }

  if (error) {
    return <PageLayout error={error} />;
  }

  if (!team) {
    return null;
  }

  return (
    <TeamRequiredWrapper>
      <TeamInfoCard
        team={team}
        userTeam={userTeam}
        isUploadingLogo={isUploadingLogo}
        onLogoChange={(e) => handleLogoChange(e, refreshTeam)}
        onLeaveTeam={handleLeaveTeam}
        onDeleteTeam={handleDeleteTeam}
        isLeaving={isLeaving}
        isDeleting={isDeleting}
      />

      {uploadErrorMessage && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {uploadErrorMessage}
        </div>
      )}

      <TeamModals
        showLeaveModal={showLeaveModal}
        showDeleteModal={showDeleteModal}
        leaveConfirmText={leaveConfirmText}
        deleteConfirmText={deleteConfirmText}
        leaveErrorMessage={leaveErrorMessage}
        deleteErrorMessage={deleteErrorMessage}
        isLeaving={isLeaving}
        isDeleting={isDeleting}
        onCloseLeaveModal={() => {
          setShowLeaveModal(false);
          setLeaveConfirmText('');
        }}
        onCloseDeleteModal={() => {
          setShowDeleteModal(false);
          setDeleteConfirmText('');
        }}
        setLeaveConfirmText={setLeaveConfirmText}
        setDeleteConfirmText={setDeleteConfirmText}
        onConfirmLeave={handleConfirmLeave}
        onConfirmDelete={handleConfirmDelete}
      />
    </TeamRequiredWrapper>
  );
}

