import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { BsTrashFill } from 'react-icons/bs'; // red trash icon
import './delete.scss'; // you can create a scss if needed

interface DeleteCategoryModalProps {
  show: boolean;
  onHide: () => void;
  onDelete: () => void;
}

export default function DeleteCategoryModal({ show, onHide, onDelete }: DeleteCategoryModalProps) {
  return (
    <Modal className='deleteModal' show={show} onHide={onHide} centered>
      <Modal.Body className="text-center">
        <div className="delete-icon-container mb-3">
          <div className="delete-icon-circle">
            <BsTrashFill size={32} color="#fff" />
          </div>
        </div>
        <h5 className="mb-3 fw-bold">Are you Sure?</h5>
        <p className="text-muted mb-4 small">
          You are about to delete these Category from your drive. You'll not be able to recover them.
        </p>
        <div className="d-flex justify-content-between">
          <Button variant="light" onClick={onHide} className="w-50 me-2 border">
            Cancel
          </Button>
          <Button variant="primary" onClick={onDelete} className="w-50">
            Delete
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}