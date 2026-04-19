// Componente Modal - Ventana modal reutilizable
import React from 'react';
import { useTranslation } from 'react-i18next';

function Modal({ isOpen, onClose, children, title }) {
  const { t } = useTranslation();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal show" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 id="modal-title">{title}</h3>
          <button className="close-btn" onClick={onClose} aria-label={t('Cerrar modal')}>&times;</button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;
