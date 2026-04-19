import React from 'react';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ onSectionChange, activeSection, isAdmin }) => {
  const { t } = useTranslation();

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: t('Dashboard'), adminOnly: false },
    { id: 'equipos', icon: '💻', label: t('Equipos'), adminOnly: false },
    { id: 'mantenimiento', icon: '🛠️', label: t('Mantenimiento'), adminOnly: false },
    { id: 'reportes', icon: '📈', label: t('Reportes'), adminOnly: false },
    { id: 'tickets', icon: '🎫', label: t('Tickets'), adminOnly: false }, 
    { id: 'auditoria', icon: '📜', label: t('Auditoría'), adminOnly: true }, 
    { id: 'ajustes', icon: '⚙️', label: t('Ajustes'), adminOnly: false },
    { id: 'ayuda', icon: '❓', label: t('Ayuda'), adminOnly: false },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        {menuItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`sidebar-btn ${activeSection === item.id ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;