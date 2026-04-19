// Componente FAQ - Preguntas frecuentes
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function FAQ() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div style={{
      backgroundColor: '#1e293b', 
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 10px 30px rgba(34, 100, 156, 0.5)',
      color: '#cbd5e1', 
      maxWidth: '800px',
      margin: '20px 0 20px 0'  
    }}>
      <h3 style={{ color: '#3b82f6', marginBottom: '15px' }}>{t("Preguntas Frecuentes")}</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li style={{ marginBottom: '10px' }}>
          <button
            onClick={() => toggleFAQ(0)}
            style={{
              width: '100%',
              backgroundColor: activeIndex === 0 ? '#2563eb' : 'transparent',
              color: activeIndex === 0 ? '#fff' : '#cbd5e1',
              border: 'none',
              textAlign: 'left',
              padding: '10px 15px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'background-color 0.3s ease'
            }}
            aria-expanded={activeIndex === 0}
            aria-controls={`faq-answer-0`}
          >
            {t("¿Cómo agregar un nuevo equipo?")}
          </button>
          {activeIndex === 0 && (
            <p
              id={`faq-answer-0`}
              style={{
                marginTop: '8px',
                padding: '10px 15px',
                backgroundColor: '#334155',
                borderRadius: '10px',
                color: '#e0e7ff',
                fontSize: '14px',
                lineHeight: '1.5'
              }}
            >
              {t("Para agregar un nuevo equipo, ve a la sección \"Equipos\" y haz clic en \"Agregar Equipo\". Completa el formulario y guarda los datos.")}
            </p>
          )}
        </li>
        <li style={{ marginBottom: '10px' }}>
          <button
            onClick={() => toggleFAQ(1)}
            style={{
              width: '100%',
              backgroundColor: activeIndex === 1 ? '#2563eb' : 'transparent',
              color: activeIndex === 1 ? '#fff' : '#cbd5e1',
              border: 'none',
              textAlign: 'left',
              padding: '10px 15px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'background-color 0.3s ease'
            }}
            aria-expanded={activeIndex === 1}
            aria-controls={`faq-answer-1`}
          >
            {t("¿Cómo registrar un mantenimiento?")}
          </button>
          {activeIndex === 1 && (
            <p
              id={`faq-answer-1`}
              style={{
                marginTop: '8px',
                padding: '10px 15px',
                backgroundColor: '#334155',
                borderRadius: '10px',
                color: '#e0e7ff',
                fontSize: '14px',
                lineHeight: '1.5'
              }}
            >
              {t("Para registrar un mantenimiento, ve a la sección \"Mantenimiento\" y haz clic en \"Agregar Mantenimiento\". Completa el formulario y guarda los datos.")}
            </p>
          )}
        </li>
        <li style={{ marginBottom: '10px' }}>
          <button
            onClick={() => toggleFAQ(2)}
            style={{
              width: '100%',
              backgroundColor: activeIndex === 2 ? '#2563eb' : 'transparent',
              color: activeIndex === 2 ? '#fff' : '#cbd5e1',
              border: 'none',
              textAlign: 'left',
              padding: '10px 15px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'background-color 0.3s ease'
            }}
            aria-expanded={activeIndex === 2}
            aria-controls={`faq-answer-2`}
          >
            {t("¿Cómo generar un reporte?")}
          </button>
          {activeIndex === 2 && (
            <p
              id={`faq-answer-2`}
              style={{
                marginTop: '8px',
                padding: '10px 15px',
                backgroundColor: '#334155',
                borderRadius: '10px',
                color: '#e0e7ff',
                fontSize: '14px',
                lineHeight: '1.5'
              }}
            >
              {t("Para generar un reporte, ve a la sección \"Reportes\" y haz clic en \"Generar Informe\".")}
            </p>
          )}
        </li>
        <li style={{ marginBottom: '10px' }}>
          <button
            onClick={() => toggleFAQ(3)}
            style={{
              width: '100%',
              backgroundColor: activeIndex === 3 ? '#2563eb' : 'transparent',
              color: activeIndex === 3 ? '#fff' : '#cbd5e1',
              border: 'none',
              textAlign: 'left',
              padding: '10px 15px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'background-color 0.3s ease'
            }}
            aria-expanded={activeIndex === 3}
            aria-controls={`faq-answer-3`}
          >
            {t("¿Qué significan los colores de estado?")}
          </button>
          {activeIndex === 3 && (
            <p
              id={`faq-answer-3`}
              style={{
                marginTop: '8px',
                padding: '10px 15px',
                backgroundColor: '#334155',
                borderRadius: '10px',
                color: '#e0e7ff',
                fontSize: '14px',
                lineHeight: '1.5'
              }}
            >
              {t("Los colores de estado significan: Verde: Operativo, Amarillo: En Mantenimiento, Rojo: Fuera de servicio.")}
            </p>
          )}
        </li>
      </ul>
    </div>
  );
}

export default FAQ;
