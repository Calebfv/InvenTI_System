// Componente ConfirmationDialog - Diálogo de confirmación
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// Recibe el mensaje a mostrar y las funciones para confirmar o cancelar.
function ConfirmationDialog({ message, onConfirm, onCancel }) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);

  // Focus the dialog when it opens and trap focus inside
  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (!dialogNode) return;
    const focusableElements = dialogNode.querySelectorAll('button');
    if (focusableElements.length) focusableElements[0].focus();

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onCancel();
      }
      if (e.key === 'Tab') {
        // Trap focus inside dialog
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    }

    dialogNode.addEventListener('keydown', handleKeyDown);
    return () => dialogNode.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-dialog-title"
      tabIndex="-1"
      style={{ padding: '25px', color: 'white', lineHeight: '1.6' }}
    >
      <p id="confirmation-dialog-title">{message}</p>
      <div className="form-actions" style={{ marginTop: '20px' }}>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          {t('Cancelar')}
        </button>
        <button type="button" className="save-btn btn-delete" onClick={onConfirm}>
          {t('Confirmar')}
        </button>
      </div>
    </div>
  );
}

export default ConfirmationDialog;
