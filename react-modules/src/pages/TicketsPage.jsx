import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import { logAuthActivity } from '../api';

const TicketsPage = ({ isAdmin, userProfile }) => {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState([]);

  // Usamos useCallback para poder llamar a la función de forma segura desde el useEffect
  const fetchTickets = useCallback(async () => {
    try {
      let query = supabase
        .from('tickets')
        .select('*, equipment:equipment_id(name, laboratoryId)')
        .order('created_at', { ascending: false });

      // LÓGICA DE SEGURIDAD: Si no es admin, filtramos por sus laboratorios permitidos
      if (!isAdmin && userProfile?.id) {
        // 1. Obtener los IDs de laboratorios que el usuario tiene permitidos
        const { data: perms, error: permsError } = await supabase
          .from('user_lab_permissions')
          .select('lab_id')
          .eq('user_id', userProfile.id);

        if (permsError) throw permsError;

        // 2. Extraer los IDs en un array (ej: ['info', 'dibujo'])
        const allowedLabIds = perms.map(p => p.lab_id);

        // 3. Filtrar la consulta de tickets
        // Nota: Filtramos por la columna laboratoryId dentro del objeto relacionado equipment
        query = query.in('equipment.laboratoryId', allowedLabIds);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Filtro de seguridad adicional en el lado del cliente por si la query .in anidada falla
      if (!isAdmin) {
        const filteredData = data.filter(ticket => 
          ticket.equipment && ticket.equipment.laboratoryId
        );
        setTickets(filteredData);
      } else {
        setTickets(data || []);
      }

    } catch (error) {
      console.error("Error al cargar tickets con filtros:", error);
    }
  }, [isAdmin, userProfile]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleUpdateStatus = async (ticketId, equipmentId, actionType) => {
    const adminName = userProfile?.name || userProfile?.email || 'Admin';

    let ticketStatus = '';
    let equipmentStatus = '';

    switch (actionType) {
      case 'RESOLVER':
        ticketStatus = 'resuelto';
        equipmentStatus = 'Activo';
        break;
      case 'INSERVIBLE':
        ticketStatus = 'cerrado';
        equipmentStatus = 'Fuera de Servicio';
        break;
      case 'PENDIENTE':
        ticketStatus = 'pendiente';
        equipmentStatus = 'En Mantenimiento';
        break;
      default:
        return;
    }

    // Get the current ticket status before updating
    const { data: currentTicket } = await supabase
      .from('tickets')
      .select('status')
      .eq('id', ticketId)
      .single();

    const oldTicketStatus = currentTicket?.status || 'desconocido';

    try {
      const { error: ticketError } = await supabase
        .from('tickets')
        .update({
          status: ticketStatus,
          resolved_by_name: actionType !== 'PENDIENTE' ? adminName : null
        })
        .eq('id', ticketId);

      const { error: equipError } = await supabase
        .from('equipment')
        .update({ status: equipmentStatus })
        .eq('id', equipmentId);

      if (!ticketError && !equipError) {
        await logAuthActivity('ticket_status_updated', {
          ticket_id: ticketId,
          equipment_id: equipmentId,
          old_status: oldTicketStatus,
          new_status: ticketStatus,
          equipment_new_status: equipmentStatus,
          action: actionType,
          admin_name: adminName
        });
        fetchTickets();
      } else {
        console.error("Error al actualizar estados:", ticketError || equipError);
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'resuelto': return 'status-badge resuelto';
      case 'cerrado': return 'status-badge cerrado';
      default: return 'status-badge pendiente';
    }
  };

  return (
    <div className="tickets-page-container">
      <header className="tickets-header">
        <h2>
          <span>🎫</span> {t('Gestión de Incidencias')}
        </h2>
        <p>
          {t('Administración técnica y control de estado de equipos.')}
        </p>
      </header>

      <div className="tickets-table-container">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>{t('ID Ticket')}</th>
              <th>{t('Equipo / Laboratorio')}</th>
              <th>{t('Problemas')}</th>
              <th>{t('Estado')}</th>
              {isAdmin && <th>{t('Acciones del Administrador')}</th>}
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="no-tickets">
                  {t('No hay tickets disponibles para tus laboratorios asignados.')}
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <span className="ticket-id">
                      {ticket.ticket_code || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div className="equipment-info">{ticket.equipment?.name || ticket.equipment_id}</div>
                    <div className="equipment-lab">{t('Lab')}: {ticket.equipment?.laboratoryId}</div>
                  </td>
                  <td>
                    <div className="issues-tags">
                      {ticket.common_issues?.map(issue => (
                        <span key={issue} className="issue-tag">
                          {t(issue)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="status-badges">
                      <span className={getStatusBadgeClass(ticket.status)}>
                        {t(ticket.status).toUpperCase()}
                      </span>
                      {ticket.resolved_by_name && (
                        <span className="resolved-by">👤 {ticket.resolved_by_name}</span>
                      )}
                    </div>
                  </td>
                  {isAdmin && (
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn reparado"
                          onClick={() => handleUpdateStatus(ticket.id, ticket.equipment_id, 'RESOLVER')}
                          title={t('Marcar como reparado y poner equipo Activo')}
                        >
                          ✅ {t('Reparado')}
                        </button>
                        <button
                          className="action-btn inservible"
                          onClick={() => handleUpdateStatus(ticket.id, ticket.equipment_id, 'INSERVIBLE')}
                          title={t('Marcar como irreparable y poner Fuera de Servicio')}
                        >
                          🛠️ {t('Inservible')}
                        </button>
                        {ticket.status !== 'pendiente' && (
                          <button
                            className="action-btn reabrir"
                            onClick={() => handleUpdateStatus(ticket.id, ticket.equipment_id, 'PENDIENTE')}
                          >
                            🔄 {t('Reabrir')}
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketsPage;