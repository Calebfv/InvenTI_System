import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

function EquipmentForm({ onSave, onCancel, initialData, labs }) {
  const { t } = useTranslation();

  // 1. Sincronizamos el estado inicial con IDs de laboratorio
  const dynamicDefaultState = useMemo(() => {
    const firstLab = labs && labs.length > 0 ? labs[0] : null;
    return {
      id: `EQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: '',
      location: firstLab ? firstLab.name : '',
      laboratoryId: firstLab ? firstLab.id : '', // Agregamos el ID para el filtro
      status: 'Activo',
      notes: ''
    };
  }, [labs]);

  const [formData, setFormData] = useState(initialData || dynamicDefaultState);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(dynamicDefaultState);
    }
  }, [initialData, dynamicDefaultState]);

  // 2. Manejo de cambios inteligente para capturar el ID del laboratorio
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "location") {
      // Cuando cambias el nombre en el select, buscamos su ID correspondiente
      const selectedLab = labs.find(lab => lab.name === value);
      setFormData(prev => ({
        ...prev,
        location: value,
        laboratoryId: selectedLab ? selectedLab.id : ''
      }));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id || !formData.name) {
      alert(t('El ID y el Nombre del equipo son obligatorios.'));
      return;
    }
    // Enviamos el objeto completo con laboratoryId incluido
    onSave(formData);
  };

  return (
    <form id="equipment-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="equipment-id">{t('ID del Equipo:')}</label>
        <input type="text" id="equipment-id" name="id" value={formData.id} onChange={handleChange} required disabled={!!initialData} />
      </div>
      
      <div className="form-group">
        <label htmlFor="equipment-name">{t('Nombre del Equipo:')}</label>
        <input type="text" id="equipment-name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      
      <div className="form-group">
        <label htmlFor="equipment-location">{t('Ubicación (Laboratorio):')}</label>
        <select 
          id="equipment-location" 
          name="location" 
          value={formData.location} 
          onChange={handleChange} 
          required
        >
            {labs && labs.length > 0 ? (
              labs.map(lab => (
                <option key={lab.id} value={lab.name}>{lab.name}</option>
              ))
            ) : (
              <option disabled>{t('No hay laboratorios')}</option>
            )}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="equipment-status">{t('Estado:')}</label>
        <select id="equipment-status" name="status" value={formData.status} onChange={handleChange} required>
            {/* Usamos los valores exactos que configuramos en EquipmentItem y FiltersBar */}
            <option value="Activo">{t('Operativo')}</option>
            <option value="En Mantenimiento">{t('En Mantenimiento')}</option> 
            <option value="Fuera de Servicio">{t('Fuera de Servicio')}</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="equipment-notes">{t('Notas:')}</label>
        <textarea id="equipment-notes" name="notes" value={formData.notes} onChange={handleChange} rows="3"></textarea>
      </div>

      <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>{t('Cancelar')}</button>
          <button type="submit" className="save-btn">{t('Guardar')}</button>
      </div>
    </form>
  );
}

export default EquipmentForm;