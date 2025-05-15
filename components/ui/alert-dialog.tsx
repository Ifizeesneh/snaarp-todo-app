'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface ConfirmContextType {
  confirm: (props: Omit<ConfirmDialogProps, 'isOpen'>) => void;
  dialog: ConfirmDialogProps | null;
  closeDialog: () => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialog, setDialog] = useState<ConfirmDialogProps | null>(null);

  const confirm = useCallback((props: Omit<ConfirmDialogProps, 'isOpen'>) => {
    setDialog({ ...props, isOpen: true });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog(null);
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm, dialog, closeDialog }}>
      {children}
      {dialog && <ConfirmDialog {...dialog} />}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (context === undefined) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

const ConfirmDialog = ({ title, message, onConfirm, onCancel }: ConfirmDialogProps) => {
  const { closeDialog } = useConfirm();

  const handleConfirm = () => {
    onConfirm();
    closeDialog();
  };

  const handleCancel = () => {
    onCancel();
    closeDialog();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full animate-slide-up">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-4">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};