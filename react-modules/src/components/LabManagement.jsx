import React from 'react';
import { useTranslation } from 'react-i18next';
import LabEquipmentList from './LabEquipmentList';

function LabManagement({ 
  labs = [], 
  allEquipment = [], 
  onDeleteLab, 
  onOpenLabModal, 
  openLabs = {}, 
  onToggleLab,
  isAdmin
}) {
  const { t } = useTranslation();

  return (
    <div className="equipment-section" style={{ marginTop: '40px' }}>
      <div className="section-header">
        <h2 className="section-title">📋 {t("Laboratorios")}</h2>
        {isAdmin && (
          <button className="add-btn" onClick={onOpenLabModal}>
            ➕ {t("Nuevo Laboratorio")}
          </button>
        )}
      </div>

      <div className="category-list">
        {labs.length === 0 ? (
          <p style={{color: '#94a3b8', padding: '20px'}}>{t("No tienes laboratorios asignados.")}</p>
        ) : (
          labs.map(lab => {
            const equipmentInLab = allEquipment.filter(eq => 
              eq.laboratoryId?.toString().trim().toLowerCase() === lab.id?.toString().trim().toLowerCase()
            );
            
            return (
              <div key={lab.id}>
                <div className="lab-card-container">
                  <button className="category-btn" onClick={() => onToggleLab(lab.id)}>
                    <div className="lab-btn-content">
                      <span className="lab-btn-icon">🖥️</span>
                      <span className="lab-btn-name">{lab.name}</span>
                    </div>
                    <span className="lab-btn-count">{equipmentInLab.length} {t("equipos")}</span>
                  </button>
                  {isAdmin && (
                    <button className="lab-delete-btn" onClick={() => onDeleteLab(lab.id)}>🗑️</button>
                  )}
                </div>
                {openLabs[lab.id] && <LabEquipmentList equipment={equipmentInLab} />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default LabManagement;