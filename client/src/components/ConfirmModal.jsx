import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold text-text mb-2">{title}</h3>
          <p className="text-secondary text-sm">{message}</p>
        </div>
        <div className="bg-background px-6 py-4 flex justify-end space-x-3 border-t border-border">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text bg-card border border-border rounded-lg hover:bg-background transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
