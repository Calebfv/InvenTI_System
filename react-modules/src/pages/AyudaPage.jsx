import React from 'react';
import { useTranslation } from 'react-i18next';
import FAQ from '../components/FAQ.jsx';

function AyudaPage() {
  const { t } = useTranslation();
  return (
    <section style={{ display: 'block' }}>
      <h2 className="section-title" style={{ marginBottom: '1rem' }}>❓ {t("Sistema de Ayuda")}</h2>
      <FAQ />
    </section>
  );
}

export default AyudaPage;
