// src/components/LabEquipmentList.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

function LabEquipmentList({ equipment }) {
  const { t } = useTranslation();

  // Mapeamos los nombres exactos que vienen de la base de datos a tus clases CSS
  const statusConfig = {
    'Activo': { class: 'status-operational' },           // Antes operational
    'En Mantenimiento': { class: 'status-warning' },     // Antes warning
    'Fuera de Servicio': { class: 'status-inactive' },   // Antes inactive
  };

  return (
    <div className="equipment-details" role="list" aria-label={t("Lista de Equipos")}>
      {equipment.length === 0 ? (
        <p style={{ color: '#888', padding: '10px 0' }}>
          {t("No hay equipos en esta categoría.")}
        </p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {equipment.map(eq => {
            // Protección: Si el estado no existe en statusConfig, usamos un valor por defecto
            const config = statusConfig[eq.status] || { class: 'status-unknown' };
            
            return (
              <li
                key={eq.id}
                // Usamos config.class que ya está validado arriba
                className={`equipment-item ${config.class}`}
                style={{ cursor: 'default', marginBottom: '10px' }}
                tabIndex={0}
                aria-describedby={`${eq.id}-location`}
              >
                <div className="equipment-header">
                  <div className="equipment-id">{eq.id}</div>
                </div>
                <div className="equipment-details" style={{ paddingBottom: 0 }}>
                  <strong>{eq.name}</strong><br />
                  <span id={`${eq.id}-location`} aria-label={t("Ubicación")}>📍 {eq.location}</span>
                  <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8 }}>
                    {t(eq.status)}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default React.memo(LabEquipmentList);