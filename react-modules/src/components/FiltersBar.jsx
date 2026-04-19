// src/components/FiltersBar.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

function FiltersBar({ searchTerm, onSearchChange, statusFilter, onStatusChange, labs, labFilter, onLabChange }) {
  const { t } = useTranslation();

  return (
    <div className="filters-bar" role="region" aria-label={t("Filtros de búsqueda y estado")}>

        <input
            type="text"
            placeholder={`🔍 ${t("Buscar equipo...")}`}
            className="search-input"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
        />

        <select
            className="filter-select"
            value={labFilter}
            onChange={(e) => onLabChange(e.target.value)}
        >
            <option value="all">{t("Todos los laboratorios")}</option>
            {labs.map(lab => (
                <option key={lab.id} value={lab.id}>{lab.name}</option>
            ))}
        </select>

        {/* CORRECCIÓN: Los valores de 'value' deben coincidir exactamente con tu Base de Datos */}
        <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
        >
            <option value="all">{t("Todos los estados")}</option>
            <option value="Activo">{t("Operativo")}</option>
            <option value="En Mantenimiento">{t("En Mantenimiento")}</option>
            <option value="Fuera de Servicio">{t("Fuera de Servicio")}</option>
        </select>
    </div>
  );
}

export default FiltersBar;