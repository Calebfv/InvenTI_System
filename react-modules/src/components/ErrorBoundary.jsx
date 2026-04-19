import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualizar el estado para mostrar la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log del error
    console.error('ErrorBoundary capturó un error:', error, errorInfo);

    // Mostrar notificación al usuario
    toast.error('Ha ocurrido un error inesperado. Por favor, recarga la página.');

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // UI de error
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          backgroundColor: '#1e293b',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          color: '#f1f5f9',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#ef4444' }}>⚠️ ¡Ups! Algo salió mal</h2>
          <p>Ha ocurrido un error inesperado al procesar los datos del laboratorio.</p>
          
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '10px',
              fontWeight: 'bold'
            }}
          >
            Recargar aplicación
          </button>

          {(process.env.NODE_ENV === 'development' || true) && (
            <details style={{ marginTop: '20px', textAlign: 'left', backgroundColor: '#0f172a', padding: '10px', borderRadius: '4px' }}>
              <summary style={{ cursor: 'pointer', color: '#94a3b8' }}>Ver detalles técnicos</summary>
              <pre style={{ 
                whiteSpace: 'pre-wrap', 
                fontSize: '12px', 
                color: '#f87171',
                marginTop: '10px' 
              }}>
                {this.state.error?.toString()}
                <br />
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;