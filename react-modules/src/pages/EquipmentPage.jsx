import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EquipmentList from '../components/EquipmentList.jsx';
import FiltersBar from '../components/FiltersBar.jsx';

// Añadimos onReportTicket a las props
function EquipmentPage({ allEquipment, allLabs, onOpenAddModal, onOpenEditModal, onDeleteEquipment, onReportTicket }) {
  const { t } = useTranslation();

  const [labFilter, setLabFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEquipment = allEquipment.filter(eq => {
    const matchSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        eq.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = (statusFilter === 'all' || eq.status === statusFilter);
    
    // Corregido: Usamos laboratoryId para filtrar por laboratorio
    const matchLab = (labFilter === 'all' || eq.laboratoryId === labFilter);

    return matchSearch && matchStatus && matchLab;
  });

  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">💻 {t("Gestión de Equipos")}</h2>
        <button className="add-btn" onClick={onOpenAddModal}>
            ➕ {t("Nuevo Equipo")}
        </button>
      </div>

      <FiltersBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        labs={allLabs}
        labFilter={labFilter}
        onLabChange={setLabFilter}
      />

      {/* Pasamos la función onReport al EquipmentList */}
      <EquipmentList
        equipmentList={filteredEquipment}
        onDelete={onDeleteEquipment}
        onEdit={onOpenEditModal}
        onReport={onReportTicket} 
      />
    </section>
  );
}

export default EquipmentPage;