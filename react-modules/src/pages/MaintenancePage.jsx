// Página Maintenance - Gestión de mantenimiento
import React from 'react';
import { useTranslation } from 'react-i18next';

function formatDate(dateStr, locale) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function MaintenancePage({ maintenanceList, equipmentList, onOpenAddModal, onOpenEditModal, onDelete }) {
  const { t, i18n } = useTranslation();

  const getEquipmentName = (equipmentId) => {
    const equipment = equipmentList.find(eq => eq.id === equipmentId);
    return equipment ? equipment.name : t('Equipo Desconocido');
  };

  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">🔧 {t("Gestión de Mantenimiento")}</h2>
        <button className="add-btn" onClick={onOpenAddModal}>
          ➕ {t("Agregar Mantenimiento")}
        </button>
      </div>

      <div id="maintenance-list" style={{ marginTop: '15px' }}>
        {maintenanceList.length === 0 ? (
          <p id="no-maintenance-msg" style={{ fontStyle: 'italic', opacity: 0.7 }}>
            {t("No hay registros de mantenimiento aún.")}
          </p>
        ) : (
          maintenanceList.map(maint => (
            <div key={maint.id} className="equipment-item">
              <div className="equipment-header">
                <strong>{getEquipmentName(maint.equipmentId)} ({maint.equipmentId})</strong>
                <span className="status-badge">{formatDate(maint.date, i18n.language)}</span>
              </div>
              <div className="equipment-details">
                <strong>{t("Notas")}:</strong><br/>
                {maint.notes || 'N/A'}
              </div>
              <div className="equipment-actions">
                  <button className="btn-edit" onClick={() => onOpenEditModal(maint)}>✏️ {t("Editar")}</button>
                  <button className="btn-delete" onClick={() => onDelete(maint.id)}>🗑️ {t("Eliminar")}</button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default MaintenancePage;
