// Componente Footer - Pie de página de la aplicación
import React from 'react';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer" role="contentinfo" style={{ gridArea: 'footer' }}>
      <p>&copy; 2026 InvenTI Web - {t("Sistema de Gestión de Inventario Tecnológico")}</p>
    </footer>
  );
}

export default Footer;
