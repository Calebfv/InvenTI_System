import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardCard from '../components/DashboardCard';
import LabManagement from '../components/LabManagement';

function DashboardPage({ allEquipment, allLabs, onDeleteLab, onOpenLabModal, isAdmin }) {
  const { t } = useTranslation();
  const [openLabs, setOpenLabs] = useState({});

  const operationalCount = useMemo(() => 
    allEquipment.filter(eq => eq.status === 'Activo').length, 
    [allEquipment]
  );
  
  const warningCount = useMemo(() => 
    allEquipment.filter(eq => eq.status === 'En Mantenimiento').length, 
    [allEquipment]
  );

  const inactiveCount = useMemo(() => 
    allEquipment.filter(eq => eq.status === 'Fuera de Servicio').length, 
    [allEquipment]
  );

  const handleToggleLab = (labId) => {
    setOpenLabs(prev => ({ ...prev, [labId]: !prev[labId] }));
  };

  return (
    <section id="dashboard-section" style={{ padding: '20px' }}>
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '26px' }}>{t("Panel de Control")}</h2>
      </div>

      <div className="dashboard-cards">
        <DashboardCard icon="✅" count={operationalCount} label={t("Equipos Operativos")} cardClass="card-green" />
        <DashboardCard icon="⚠️" count={warningCount} label={t("En Mantenimiento")} cardClass="card-yellow" />
        <DashboardCard icon="❌" count={inactiveCount} label={t("Fuera de Servicio")} cardClass="card-red" />
      </div>

      <div style={{ margin: '40px 0' }}></div>

      <LabManagement
        labs={allLabs}
        allEquipment={allEquipment}
        onDeleteLab={onDeleteLab}
        onOpenLabModal={onOpenLabModal}
        openLabs={openLabs}
        onToggleLab={handleToggleLab}
        isAdmin={isAdmin}
      />
    </section>
  );
}

export default React.memo(DashboardPage);