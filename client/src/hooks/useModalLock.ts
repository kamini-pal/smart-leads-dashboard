import { useEffect } from 'react';

/**
 * Locks body scroll and closes modal on Escape when open.
 */
const useModalLock = (isOpen: boolean, onClose: () => void, canClose = true) => {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && canClose) onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose, canClose]);
};

export default useModalLock;
