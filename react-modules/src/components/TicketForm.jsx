import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TicketForm = ({ equipment, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [comments, setComments] = useState('');

  const issues = [
    'Se apaga de la nada', 'Se congela la pantalla',
    'Lentitud extrema', 'No reconoce periféricos (Teclado/Mouse)',
    'No tiene internet / Falla de red', 'Ruido extraño en el equipo'
  ];

  const handleToggleIssue = (issue) => {
    setSelectedIssues(prev => 
      prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]
    );
  };

  return (
    <div style={{ color: '#f1f5f9', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
        <span style={{ color: '#94a3b8', fontSize: '13px' }}>{t('Reportando para')}:</span>
        <div style={{ fontSize: '16px', fontWeight: '700', color: '#60a5fa' }}>{equipment?.name}</div>
      </div>

      <div>
        <label style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '10px', display: 'block' }}>
          {t('Seleccione los problemas detectados')}:
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {issues.map(issue => (
            <label key={issue} style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', 
              backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', 
              cursor: 'pointer', fontSize: '13px', transition: '0.2s'
            }}>
              <input 
                type="checkbox" 
                checked={selectedIssues.includes(issue)}
                onChange={() => handleToggleIssue(issue)}
                style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }}
              />
              {t(issue)}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px', display: 'block' }}>
          {t('Comentarios adicionales')}:
        </label>
        <textarea 
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder={t('Explique brevemente el problema...')}
          style={{ 
            width: '100%', height: '100px', padding: '12px', borderRadius: '8px', 
            backgroundColor: '#0f172a', color: '#fff', border: '1px solid #334155',
            resize: 'none', outline: 'none', fontSize: '14px'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
        <button 
          onClick={() => onSave({ equipment_id: equipment.id, common_issues: selectedIssues, comments })}
          disabled={selectedIssues.length === 0}
          style={{ 
            flex: 2, padding: '12px', backgroundColor: selectedIssues.length === 0 ? '#334155' : '#10b981', 
            color: 'white', border: 'none', borderRadius: '8px', cursor: selectedIssues.length === 0 ? 'not-allowed' : 'pointer',
            fontWeight: '700', fontSize: '14px'
          }}
        >
          {t('Enviar Reporte')}
        </button>
        <button 
          onClick={onCancel}
          style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
        >
          {t('Cancelar')}
        </button>
      </div>
    </div>
  );
};

export default TicketForm;