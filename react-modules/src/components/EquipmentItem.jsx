import React from 'react';
import { useTranslation } from 'react-i18next';

// 1. CORRECCIÓN DE LLAVES: Ahora coinciden con el valor real de tu base de datos
const statusConfig = {
    "Activo": { label: 'Operativo', class: 'status-operational' },
    "En Mantenimiento": { label: 'En Mantenimiento', class: 'status-warning' },
    "Fuera de Servicio": { label: 'Fuera de Servicio', class: 'status-inactive' }
};

function formatDate(dateStr, locale) {
    if (!dateStr) return 'N/A';
    try {
        const date = new Date(dateStr);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    } catch (e) {
        return 'N/A';
    }
}

function EquipmentItem({ equipment, onDelete, onEdit, onReport }) {
    const { t, i18n } = useTranslation();

    // 2. VERIFICACIÓN FLEXIBLE: Si el estado no existe, mostramos el texto plano en lugar de bloquear
    const currentStatus = statusConfig[equipment.status] || { 
        label: equipment.status || 'Desconocido', 
        class: 'status-inactive' 
    };

    const knownNotes = ['software_outdated', 'mechanical_failure', 'rgb_maximum'];
    const displayNote = knownNotes.includes(equipment.notes)
        ? t(equipment.notes)
        : equipment.notes || 'N/A';

    return (
        <div className={`equipment-item ${currentStatus.class}`}>
            <div className="equipment-header">
                <div className="equipment-id">{equipment.id}</div>
                <div className={`status-badge ${currentStatus.class}`}>
                    {/* t() intentará traducir, si no encuentra traducción usará el label directamente */}
                    {t(currentStatus.label)}
                </div>
            </div>
            <div className="equipment-details">
                <strong>{equipment.name}</strong><br />
                📍 {t("Ubicación")}: {equipment.location || t("No especificada")}<br />
                📅 {t("Último Mantenimiento")}: {formatDate(equipment.lastMaintenance, i18n.language)}<br />
                📝 {t("Notas")}: {displayNote}
            </div>
            <div className="equipment-actions">
                <button 
                    className="btn-report" 
                    onClick={() => onReport(equipment)}
                    style={{
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontWeight: 'bold'
                    }}
                >
                    ⚠️ {t("Reportar")}
                </button>

                <button className="btn-edit" onClick={() => onEdit(equipment)}>
                    ✏️ {t("Editar")}
                </button>
                
                <button className="btn-delete" onClick={() => onDelete(equipment.id)}>
                    🗑️ {t("Eliminar")}
                </button>
            </div>
        </div>
    );
}

export default EquipmentItem;