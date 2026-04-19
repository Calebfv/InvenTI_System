import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Función para obtener la fecha actual en formato YYYY-MM-DD
const getCurrentDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now.getTime() - offset);
  return localDate.toISOString().split('T')[0];
};

const getInitialState = (initialData, equipmentList) => {
  if (initialData) {
    return {
      id: initialData.id,
      equipmentId: initialData.equipmentId,
      date: initialData.date || getCurrentDate(),
      notes: initialData.notes || ''
    };
  }
  return {
    equipmentId: equipmentList && equipmentList.length > 0 ? equipmentList[0].id : '',
    date: getCurrentDate(),
    notes: ''
  };
};

function MaintenanceForm({ equipmentList, onSave, onCancel, initialData }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(getInitialState(initialData, equipmentList));
  const [dateError, setDateError] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    setFormData(getInitialState(initialData, equipmentList));
    setIsTouched(false);
    setDateError('');
  }, [initialData, equipmentList]);

  const validateDate = (dateString) => {
    if (!dateString) return t('La fecha es requerida.');
    if (!initialData && dateString < getCurrentDate()) {
      return t('No se pueden asignar mantenimientos para fechas anteriores a la actual.');
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date') {
      setIsTouched(true);
      setDateError(validateDate(value));
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const error = validateDate(formData.date);
    if (error) {
      setDateError(error);
      return;
    }

    if (!formData.equipmentId || !formData.date) {
      alert(t('Debe seleccionar un equipo y una fecha.'));
      return;
    }

    // LIMPIEZA CRÍTICA
    const dataToSave = {
      id: formData.id || `MNT-${Date.now()}`,
      equipmentId: formData.equipmentId,
      date: formData.date,
      notes: formData.notes
    };

    onSave(dataToSave);
  };

  return (
    <form id="maintenance-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="maintenance-equipment">{t('Equipo:')}</label>
        <select
          id="maintenance-equipment"
          name="equipmentId"
          value={formData.equipmentId}
          onChange={handleChange}
          required
          disabled={!!initialData}
        >
          {(!equipmentList || equipmentList.length === 0) ? (
            <option disabled>{t('No hay equipos')}</option>
          ) : (
            equipmentList.map(eq => (
              <option key={eq.id} value={eq.id}>{eq.name} ({eq.id})</option>
            ))
          )}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="maintenance-date">{t('Fecha:')}</label>
        <input
          type="date"
          id="maintenance-date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          onBlur={() => setIsTouched(true)}
          required
        />
        {isTouched && dateError && (
          <div className="error-message" style={{color: '#ef4444', fontSize: '12px', marginTop: '5px'}}>
            {dateError}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="maintenance-notes">{t('Notas:')}</label>
        <textarea
          id="maintenance-notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
          placeholder={t('Detalles del mantenimiento')}
          style={{ width: '100%', boxSizing: 'border-box' }}
        ></textarea>
      </div>

      <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          {t('Cancelar')}
        </button>
        <button
          type="submit"
          className="save-btn"
          disabled={!!dateError}
          style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
        >
          {t('Guardar')}
        </button>
      </div>
    </form>
  );
}

export default MaintenanceForm;