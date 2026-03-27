import React, { createContext, useContext, useState, useCallback } from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import clsx from 'clsx';

const ToastContext = createContext(null);

const VARIANT_STYLES = {
  success: {
    border: 'border-l-4 border-[#16A34A]',
    icon: (
      <svg className="w-4 h-4 text-[#16A34A]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
      </svg>
    ),
  },
  error: {
    border: 'border-l-4 border-[#DC2626]',
    icon: (
      <svg className="w-4 h-4 text-[#DC2626]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
      </svg>
    ),
  },
  info: {
    border: 'border-l-4 border-[#1D4ED8]',
    icon: (
      <svg className="w-4 h-4 text-[#1D4ED8]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
      </svg>
    ),
  },
};

let _toastFn = null;

export function toast(message, variant = 'info') {
  if (_toastFn) _toastFn(message, variant);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, variant = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  // expose imperatively
  _toastFn = addToast;

  return (
    <ToastContext.Provider value={addToast}>
      <RadixToast.Provider swipeDirection="right">
        {children}
        {toasts.map(({ id, message, variant }) => {
          const style = VARIANT_STYLES[variant] || VARIANT_STYLES.info;
          return (
            <RadixToast.Root
              key={id}
              className={clsx(
                'bg-[#1E293B] border border-[#334155] rounded-[8px] shadow-md px-4 py-3',
                'flex items-start gap-3 w-80',
                'data-[state=open]:animate-in data-[state=closed]:animate-out',
                'data-[state=closed]:fade-out data-[state=open]:fade-in',
                style.border
              )}
              open
              onOpenChange={(open) => {
                if (!open) setToasts((prev) => prev.filter((t) => t.id !== id));
              }}
            >
              <div className="mt-0.5 shrink-0">{style.icon}</div>
              <RadixToast.Description className="text-sm text-[#F1F5F9] flex-1">
                {message}
              </RadixToast.Description>
              <RadixToast.Close className="text-[#94A3B8] hover:text-[#F1F5F9] shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </RadixToast.Close>
            </RadixToast.Root>
          );
        })}
        <RadixToast.Viewport className="fixed bottom-5 right-5 flex flex-col gap-2 z-[100] outline-none" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
