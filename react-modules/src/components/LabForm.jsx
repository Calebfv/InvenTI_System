// Componente LabForm - Formulario para laboratorios
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function LabForm({ onSave, onCancel }) {
  const { t } = useTranslation();
  const [labName, setLabName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!labName.trim()) {
      alert(t('El nombre del laboratorio no puede estar vacío.'));
      return;
    }
    onSave(labName.trim());
    setLabName(''); 
  };

  return (
    <form id="lab-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="lab-name-input">{t('Nombre del Laboratorio:')}</label>
        <input
          type="text"
          id="lab-name-input"
          value={labName}
          onChange={(e) => setLabName(e.target.value)}
          required
          placeholder={t('Ej: Laboratorio de Redes')}
        />
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>{t('Cancelar')}</button>
        <button type="submit" className="save-btn">{t('Guardar')}</button>
      </div>
    </form>
  );
}

export default LabForm;
