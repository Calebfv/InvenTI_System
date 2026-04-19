import React from 'react';
import { useTranslation } from 'react-i18next';
import EquipmentItem from './EquipmentItem.jsx';

// Añadimos onReport a las props recibidas
function EquipmentList({ equipmentList, onDelete, onEdit, onReport }) {
  const { t } = useTranslation();

  return (
    <div className="equipment-list">
      {equipmentList.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
          {t("No se encontraron equipos.")}
        </p>
      ) : (
        equipmentList.map(equipment => (
          <EquipmentItem
            key={equipment.id}
            equipment={equipment}
            onDelete={onDelete}
            onEdit={onEdit}
            onReport={onReport} // Pasamos la función al hijo final
          />
        ))
      )}
    </div>
  );
}

export default EquipmentList;