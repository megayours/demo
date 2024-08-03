import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-content bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background)] rounded-lg p-6 max-w-sm w-full border border-[var(--color-primary)] shadow-lg">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-300">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;