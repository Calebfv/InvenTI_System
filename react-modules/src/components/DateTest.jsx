// Componente de prueba para verificar el sistema de fechas
import React, { useState } from 'react';

// Función robusta para obtener la fecha actual en formato YYYY-MM-DD
const getCurrentDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
};

// Función para comparar fechas sin problemas de zona horaria
const compareDates = (dateStr1, dateStr2) => {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);
  
  // Comparar solo año, mes y día
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  
  return {
    isBefore: date1 < date2,
    isAfter: date1 > date2,
    isEqual: date1.getTime() === date2.getTime()
  };
};

const validateDate = (dateString) => {
  if (!dateString) {
    return 'La fecha es requerida.';
  }
  
  const today = getCurrentDate();
  const comparison = compareDates(dateString, today);
  
  // Permitir fechas actuales y futuras
  if (comparison.isBefore) {
    return 'No se pueden asignar mantenimientos para fechas anteriores a la actual.';
  }
  
  return ''; // No hay error
};

function DateTest() {
  const [testDate, setTestDate] = useState(getCurrentDate());
  const [error, setError] = useState('');
  const [testResults, setTestResults] = useState([]);

  const handleTest = () => {
    const result = validateDate(testDate);
    setError(result);
    
    const today = getCurrentDate();
    const comparison = compareDates(testDate, today);
    
    setTestResults([
      `Fecha actual: ${today}`,
      `Fecha probada: ${testDate}`,
      `Es anterior: ${comparison.isBefore}`,
      `Es posterior: ${comparison.isAfter}`,
      `Es igual: ${comparison.isEqual}`,
      `Error: ${result || 'Ninguno'}`
    ]);
  };

  return (
    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', margin: '20px' }}>
      <h3>Prueba del Sistema de Fechas</h3>
      <div style={{ marginBottom: '15px' }}>
        <label>Fecha a probar: </label>
        <input 
          type="date" 
          value={testDate} 
          onChange={(e) => setTestDate(e.target.value)}
          style={{ padding: '5px', margin: '0 10px' }}
        />
        <button onClick={handleTest} style={{ padding: '5px 10px' }}>
          Probar
        </button>
      </div>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>
          Error: {error}
        </div>
      )}
      
      <div>
        <h4>Resultados:</h4>
        {testResults.map((result, index) => (
          <div key={index} style={{ margin: '5px 0', fontFamily: 'monospace' }}>
            {result}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DateTest;
