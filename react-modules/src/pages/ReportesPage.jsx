import React from 'react';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import XLSX from 'xlsx-js-style';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ReportesPage({ allEquipment, allLabs }) {
  const { t } = useTranslation();

  // 1. ESTADÍSTICAS GENERALES (Sincronizadas con nuevos nombres)
  const operational = allEquipment.filter(eq => eq.status === 'Activo').length;
  const warning = allEquipment.filter(eq => eq.status === 'En Mantenimiento').length;
  const inactive = allEquipment.filter(eq => eq.status === 'Fuera de Servicio').length; // Corregido: eliminado comillas extra
  const total = allEquipment.length;

  // 2. CONFIGURACIÓN DE GRÁFICOS
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false } 
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: { color: '#eee', stepSize: 1 }, 
        grid: { color: 'rgba(255,255,255,0.1)' } 
      },
      x: { 
        ticks: { color: '#eee' }, 
        grid: { display: false } 
      }
    }
  };

  const handleGenerateReport = (data, title) => {
    if (data.length === 0) {
      toast.error(t('No hay datos para exportar'));
      return;
    }
    const headers = [t('ID'), t('Nombre'), t('Estado'), t('Ubicación')];
    const rows = data.map(eq => [eq.id, eq.name, t(eq.status), eq.location || '']);
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
    XLSX.writeFile(workbook, `${title}.xlsx`);
  };

  return (
    <section style={{ color: 'white', padding: '20px' }}>
      <h2 className="section-title">📈 {t("Reportes y Estadísticas")}</h2>
      
      {/* Resumen Superior */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ background: '#1e293b', padding: '10px 20px', borderRadius: '8px', minWidth: '120px' }}>
          <strong>{t("Total")}:</strong> {total}
        </div>
        <div style={{ background: '#1e293b', padding: '10px 20px', borderRadius: '8px', borderBottom: '3px solid #22c55e', minWidth: '120px' }}>
          <strong>{t("Activos")}:</strong> {operational}
        </div>
        <div style={{ background: '#1e293b', padding: '10px 20px', borderRadius: '8px', borderBottom: '3px solid #f59e0b', minWidth: '120px' }}>
          <strong>{t("Mantenimiento")}:</strong> {warning}
        </div>
        <div style={{ background: '#1e293b', padding: '10px 20px', borderRadius: '8px', borderBottom: '3px solid #ef4444', minWidth: '120px' }}>
          <strong>{t("Inactivos")}:</strong> {inactive}
        </div>
      </div>

      {/* Gráfico General */}
      <div style={{ height: '300px', marginBottom: '50px', background: 'rgba(30, 41, 59, 0.5)', padding: '20px', borderRadius: '15px' }}>
        <Bar 
          options={{
            ...commonOptions, 
            plugins: { 
              ...commonOptions.plugins,
              title: { display: true, text: t('Estado General del Inventario'), color: 'white', font: { size: 18 } } 
            }
          }} 
          data={{
            labels: [t('Activos'), t('Mantenimiento'), t('Inactivos')],
            datasets: [{ 
              data: [operational, warning, inactive], 
              backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'] 
            }]
          }} 
        />
      </div>

      {/* Grid de Laboratorios */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {allLabs.map(lab => {
          // Filtrar por laboratorio usando laboratoryId o location según tu estructura
          const labEquipment = allEquipment.filter(eq => eq.laboratoryId === lab.id || eq.category === lab.id);
          const lOp = labEquipment.filter(eq => eq.status === 'Activo').length;
          const lWa = labEquipment.filter(eq => eq.status === 'En Mantenimiento').length;
          const lIn = labEquipment.filter(eq => eq.status === 'Fuera de Servicio').length;

          return (
            <div key={lab.id} style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>{lab.name}</h3>
                <span style={{ fontSize: '0.8em', background: '#334155', padding: '2px 8px', borderRadius: '10px' }}>
                  {labEquipment.length} {t("equipos")}
                </span>
              </div>
              <div style={{ height: '180px' }}>
                <Bar 
                  options={commonOptions} 
                  data={{
                    labels: [t('Activos'), t('Mantenimiento'), t('Inactivos')],
                    datasets: [{ 
                      data: [lOp, lWa, lIn], 
                      backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'] 
                    }]
                  }} 
                />
              </div>
              <button 
                onClick={() => handleGenerateReport(labEquipment, lab.name)}
                style={{ width: '100%', marginTop: '15px', padding: '10px', cursor: 'pointer', borderRadius: '6px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 'bold' }}
              >
                📄 {t("Generar Informe")}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ReportesPage;