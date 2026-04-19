import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAuditLogs, getSecurityStats } from '../api.js';

const AuditLogsPage = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [logsData, statsData] = await Promise.all([
        getAuditLogs(),
        getSecurityStats()
      ]);

      setLogs(logsData || []);

      // getSecurityStats devuelve un objeto directamente
      if (statsData) {
        setStats(statsData);
      } else {
        setStats({
          total_users: 0,
          successful_logins: 0,
          failed_logins: 0,
          active_sessions: 0
        });
      }

    } catch (error) {
      console.error('Error loading audit data:', error);
      const localLogs = JSON.parse(localStorage.getItem('authLogs') || '[]');
      setLogs(localLogs);
      setStats({
        total_users: 0,
        successful_logins: localLogs.filter(l => l.activity === 'login_success').length,
        failed_attempts: localLogs.filter(l => l.activity === 'login_failed').length,
        active_sessions: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.activity === filter;
    const matchesSearch = !searchTerm ||
      log.details?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.activity.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getActivityIcon = (activity) => {
    switch (activity) {
      case 'login_success': return '✅';
      case 'login_failed': return '❌';
      case 'logout': return '🚪';
      case 'register_success': return '👤';
      case 'register_failed': return '⚠️';
      case 'equipment_created': return '🔧';
      case 'equipment_updated': return '⚙️';
      case 'equipment_deleted': return '🗑️';
      case 'ticket_created': return '🎫';
      case 'ticket_status_updated': return '📋';
      case 'lab_deleted': return '🏢';
      case 'maintenance_deleted': return '🔧';
      default: return '📝';
    }
  };

  const getActivityColor = (activity) => {
    switch (activity) {
      case 'login_success': return '#10b981';
      case 'login_failed': return '#ef4444';
      case 'logout': return '#f59e0b';
      case 'register_success': return '#3b82f6';
      case 'register_failed': return '#f97316';
      case 'equipment_created': return '#06b6d4';
      case 'equipment_updated': return '#8b5cf6';
      case 'equipment_deleted': return '#ef4444';
      case 'ticket_created': return '#f59e0b';
      case 'ticket_status_updated': return '#10b981';
      case 'lab_deleted': return '#6b7280';
      case 'maintenance_deleted': return '#6b7280';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>{t('Cargando...')}</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{
        color: '#cbd5e1',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '2rem',
        fontWeight: 'bold'
      }}>
        📊 {t('Auditoría de Seguridad')}
      </h1>

      {/* Security Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Usuarios Totales - Mejorado con gradiente moderno */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          padding: '25px',
          borderRadius: '16px',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}></div>
          <h3 style={{
            color: '#94a3b8',
            margin: '0 0 15px 0',
            fontSize: '16px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            👥 {t('Usuarios Totales')}
          </h3>
          <p style={{
            color: '#cbd5e1',
            fontSize: '42px',
            fontWeight: 'bold',
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            {stats.total_users || 0}
          </p>
        </div>

        {/* Logins Exitosos */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #10b981 50%, #34d399 100%)',
          padding: '25px',
          borderRadius: '16px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}></div>
          <h3 style={{
            color: '#d1fae5',
            margin: '0 0 15px 0',
            fontSize: '16px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            ✅ {t('Logins Exitosos')}
          </h3>
          <p style={{
            color: 'white',
            fontSize: '42px',
            fontWeight: 'bold',
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            {stats.successful_logins || 0}
          </p>
        </div>

        {/* Intentos Fallidos */}
        <div style={{
          background: 'linear-gradient(135deg, #7f1d1d 0%, #ef4444 50%, #f87171 100%)',
          padding: '25px',
          borderRadius: '16px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}></div>
          <h3 style={{
            color: '#fecaca',
            margin: '0 0 15px 0',
            fontSize: '16px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            ❌ {t('Intentos Fallidos')}
          </h3>
          <p style={{
            color: 'white',
            fontSize: '42px',
            fontWeight: 'bold',
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            {stats.failed_attempts || 0}
          </p>
        </div>

        {/* Sesiones Activas */}
        <div style={{
          background: 'linear-gradient(135deg, #9a3412 0%, #f97316 50%, #fb923c 100%)',
          padding: '25px',
          borderRadius: '16px',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(249, 115, 22, 0.2)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}></div>
          <h3 style={{
            color: '#fed7aa',
            margin: '0 0 15px 0',
            fontSize: '16px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            🔐 {t('Sesiones Activas')}
          </h3>
          <p style={{
            color: 'white',
            fontSize: '42px',
            fontWeight: 'bold',
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            {stats.active_sessions || 0}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div>
          <label style={{
            color: '#94a3b8',
            marginRight: '10px',
            fontWeight: '500'
          }}>
            {t('Filtrar por actividad:')}
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              color: '#cbd5e1',
              fontSize: '14px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              outline: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <option value="all">{t('Todas')}</option>
            <option value="login_success">{t('Login Exitoso')}</option>
            <option value="login_failed">{t('Login Fallido')}</option>
            <option value="logout">{t('Logout')}</option>
            <option value="register_success">{t('Registro Exitoso')}</option>
            <option value="register_failed">{t('Registro Fallido')}</option>
            <option value="equipment_created">{t('Equipo Creado')}</option>
            <option value="equipment_updated">{t('Equipo Actualizado')}</option>
            <option value="equipment_deleted">{t('Equipo Eliminado')}</option>
            <option value="lab_deleted">{t('Laboratorio Eliminado')}</option>
            <option value="maintenance_deleted">{t('Mantenimiento Eliminado')}</option>
            <option value="ticket_created">{t('Ticket Creado')}</option>
            <option value="ticket_status_updated">{t('Estado de Ticket Actualizado')}</option>
          </select>
        </div>

        <div>
          <label style={{
            color: '#94a3b8',
            marginRight: '10px',
            fontWeight: '500'
          }}>
            {t('Buscar:')}
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('Buscar por email o actividad...')}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              color: '#cbd5e1',
              fontSize: '14px',
              minWidth: '280px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
          />
        </div>
      </div>

      {/* Logs Table */}
      <div style={{
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        borderRadius: '16px',
        border: '1px solid rgba(71, 85, 105, 0.3)',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          padding: '20px 25px',
          borderBottom: '1px solid rgba(71, 85, 105, 0.3)',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            color: '#cbd5e1',
            margin: 0,
            fontSize: '18px',
            fontWeight: '600'
          }}>
            📋 {t('Registro de Actividades')}
          </h3>
        </div>

        <div style={{
          maxHeight: '600px',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(71, 85, 105, 0.5) transparent'
        }}>
          {filteredLogs.length === 0 ? (
            <div style={{
              padding: '60px 40px',
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: '16px'
            }}>
              {t('No se encontraron registros de auditoría')}
            </div>
          ) : (
            filteredLogs.map((log, index) => (
              <div
                key={index}
                style={{
                  padding: '18px 25px',
                  borderBottom: index < filteredLogs.length - 1 ? '1px solid rgba(71, 85, 105, 0.2)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.4)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  ':hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.1)'
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.4)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{
                  fontSize: '20px',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                }}>
                  {getActivityIcon(log.activity)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '6px'
                  }}>
                    <span style={{
                      color: getActivityColor(log.activity),
                      fontWeight: 'bold',
                      fontSize: '15px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {t(log.activity.replace('_', ' ').toUpperCase())}
                    </span>
                    <span style={{
                      color: '#64748b',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div style={{
                    color: '#94a3b8',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    {log.activity === 'ticket_status_updated' ? (
                      <>
                        {log.details?.ticket_id && (
                          <span>
                            🎫 <strong>{t('ID Ticket')}:</strong> {log.details.ticket_id}
                          </span>
                        )}
                        {log.details?.old_status && (
                          <span style={{ marginLeft: '15px' }}>
                            📊 <strong>{t('Estado Anterior')}:</strong> {log.details.old_status}
                          </span>
                        )}
                        {log.details?.equipment_new_status && (
                          <span style={{ marginLeft: '15px' }}>
                            🔧 <strong>{t('Estado Nuevo Equipo')}:</strong> {log.details.equipment_new_status}
                          </span>
                        )}
                        {log.details?.admin_name && (
                          <span style={{ marginLeft: '15px' }}>
                            👤 <strong>{t('Admin')}:</strong> {log.details.admin_name}
                          </span>
                        )}
                      </>
                    ) : log.activity === 'ticket_created' ? (
                      <>
                        {log.details?.ticket_code && (
                          <span>
                            🎫 <strong>{t('Ticket')}:</strong> {log.details.ticket_code}
                          </span>
                        )}
                        {log.details?.equipment_name && (
                          <span style={{ marginLeft: '15px' }}>
                            🔧 <strong>{t('Equipo')}:</strong> {log.details.equipment_name}
                          </span>
                        )}
                        {log.user_email && (
                          <span style={{ marginLeft: '15px' }}>
                            👤 <strong>{t('Creado por')}:</strong> {log.user_email}
                          </span>
                        )}
                      </>
                    ) : log.activity === 'equipment_created' || log.activity === 'equipment_updated' || log.activity === 'equipment_deleted' ? (
                      <>
                        {log.details?.equipment_name && (
                          <span>
                            🔧 <strong>{t('Equipo')}:</strong> {log.details.equipment_name}
                          </span>
                        )}
                      </>
                    ) : log.activity === 'lab_created' || log.activity === 'lab_deleted' ? (
                      <>
                        {log.details?.lab_name && (
                          <span>
                            🏢 <strong>{t('Laboratorio')}:</strong> {log.details.lab_name}
                          </span>
                        )}
                      </>
                    ) : log.activity === 'maintenance_created' || log.activity === 'maintenance_deleted' ? (
                      <>
                        {log.details?.maintenance_id && (
                          <span>
                            🔧 <strong>{t('Mantenimiento')}:</strong> {log.details.maintenance_id}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        {log.details?.email && (
                          <span>
                            👤 <strong>{t('Usuario')}:</strong> {log.details.email}
                          </span>
                        )}
                        {log.details?.error && (
                          <span style={{ color: '#ef4444', marginLeft: '15px' }}>
                            ⚠️ {log.details.error}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;
