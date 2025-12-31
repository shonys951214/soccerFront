'use client';

import { useState } from 'react';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import CreateMatchForm from './CreateMatchForm';

interface CreateMatchButtonProps {
  teamId: string;
  onSuccess: () => void;
}

export default function CreateMatchButton({
  teamId,
  onSuccess,
}: CreateMatchButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        경기 추가
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="경기 등록"
        size="md"
      >
        <CreateMatchForm
          teamId={teamId}
          onSuccess={() => {
            setIsOpen(false);
            onSuccess();
          }}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
}

