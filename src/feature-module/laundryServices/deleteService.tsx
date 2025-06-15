import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { BsTrashFill } from 'react-icons/bs'; // red trash icon
import './delete.scss'; // you can create a scss if needed

interface DeleteCategoryModalProps {
  show: boolean;
  onHide: () => void;
  onDelete: (note: string) => void;
}

export default function DeleteCategoryModal({ show, onHide, onDelete }: DeleteCategoryModalProps) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState('');

  const handleDeleteClick = () => {
    setShowNoteInput(true);
  };

  const handleCancelNote = () => {
    setShowNoteInput(false);
    setNote('');
  };

  const handleSubmit = () => {
    if (note.trim()) {
      onDelete(note);
      setShowNoteInput(false);
      setNote('');
      onHide();
    }
  };

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
        {showNoteInput ? (
          <>
            <textarea
              name="note"
              className="form-control mb-3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter a note (required)"
              rows={4}
              required
            />
            <div className="d-flex justify-content-between">
              <Button variant="light" onClick={handleCancelNote} className="w-50 me-2 border">
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                className="w-50"
                disabled={!note.trim()}
              >
                Submit
              </Button>
            </div>
          </>
        ) : (
          <div className="d-flex justify-content-between">
            <Button variant="light" onClick={onHide} className="w-50 me-2 border">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDeleteClick} className="w-50">
              Delete
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}