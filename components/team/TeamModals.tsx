import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

interface TeamModalsProps {
  showLeaveModal: boolean;
  showDeleteModal: boolean;
  leaveConfirmText: string;
  deleteConfirmText: string;
  leaveErrorMessage: string;
  deleteErrorMessage: string;
  isLeaving: boolean;
  isDeleting: boolean;
  onCloseLeaveModal: () => void;
  onCloseDeleteModal: () => void;
  setLeaveConfirmText: (text: string) => void;
  setDeleteConfirmText: (text: string) => void;
  onConfirmLeave: () => void;
  onConfirmDelete: () => void;
}

export default function TeamModals({
  showLeaveModal,
  showDeleteModal,
  leaveConfirmText,
  deleteConfirmText,
  leaveErrorMessage,
  deleteErrorMessage,
  isLeaving,
  isDeleting,
  onCloseLeaveModal,
  onCloseDeleteModal,
  setLeaveConfirmText,
  setDeleteConfirmText,
  onConfirmLeave,
  onConfirmDelete,
}: TeamModalsProps) {
  return (
    <>
      {/* 팀 탈퇴 확인 모달 */}
      <Modal
        isOpen={showLeaveModal}
        onClose={onCloseLeaveModal}
        title="팀 탈퇴 확인"
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={onCloseLeaveModal}
              disabled={isLeaving}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={onConfirmLeave}
              isLoading={isLeaving}
              disabled={leaveConfirmText.trim() !== '탈퇴'}
              className="flex-1"
            >
              탈퇴하기
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-semibold mb-2">⚠️ 경고</p>
            <p className="text-sm text-red-700">
              팀을 탈퇴하면 모든 팀 데이터에 대한 접근 권한이 제거됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700 mb-2">
              정말로 팀을 탈퇴하시겠습니까? 확인을 위해 <strong className="text-red-600">"탈퇴"</strong>를 입력해주세요.
            </p>
            <Input
              type="text"
              placeholder="탈퇴"
              value={leaveConfirmText}
              onChange={(e) => {
                setLeaveConfirmText(e.target.value);
              }}
              className="w-full"
            />
          </div>
          {leaveErrorMessage && (
            <div className="text-red-600 text-sm">{leaveErrorMessage}</div>
          )}
        </div>
      </Modal>

      {/* 팀 삭제 확인 모달 */}
      <Modal
        isOpen={showDeleteModal}
        onClose={onCloseDeleteModal}
        title="팀 삭제 확인"
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={onCloseDeleteModal}
              disabled={isDeleting}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={onConfirmDelete}
              isLoading={isDeleting}
              disabled={deleteConfirmText.trim() !== '삭제'}
              className="flex-1"
            >
              삭제하기
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-semibold mb-2">⚠️ 경고</p>
            <p className="text-sm text-red-700">
              팀을 삭제하면 모든 팀 데이터(경기 기록, 통계, 팀원 정보 등)가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700 mb-2">
              정말로 팀을 삭제하시겠습니까? 확인을 위해 <strong className="text-red-600">"삭제"</strong>를 입력해주세요.
            </p>
            <Input
              type="text"
              placeholder="삭제"
              value={deleteConfirmText}
              onChange={(e) => {
                setDeleteConfirmText(e.target.value);
              }}
              className="w-full"
            />
          </div>
          {deleteErrorMessage && (
            <div className="text-red-600 text-sm">{deleteErrorMessage}</div>
          )}
        </div>
      </Modal>
    </>
  );
}

