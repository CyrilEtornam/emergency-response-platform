import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { Button } from './Button';

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
}) {
  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }[size];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40 animate-in fade-in" />
        <Dialog.Content
          className={clsx(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
            'bg-surface border border-subtle rounded-[8px] w-full',
            'focus:outline-none',
            sizeClass
          )}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-subtle flex items-center justify-between">
            <div>
              <Dialog.Title className="text-[17px] font-semibold text-primary">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="text-[13px] text-secondary mt-0.5">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close asChild>
              <button className="text-secondary hover:text-primary transition-colors p-1 -mr-1 rounded-[4px]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="px-6 py-5">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-subtle flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ConfirmDialog({ open, onOpenChange, title, description, onConfirm, loading }) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title || 'Confirm action'}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="danger" loading={loading} onClick={onConfirm}>
            Confirm
          </Button>
        </>
      }
    >
      <p className="text-[13px] text-secondary">This action cannot be undone.</p>
    </Modal>
  );
}
