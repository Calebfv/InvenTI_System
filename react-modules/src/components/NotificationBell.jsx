import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';

function NotificationBell({ userId, isAdmin, userName }) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (isAdmin || userName === 'inventiwebcr') {
      query = query.or(`user_id.is.null,user_id.eq.${userId}`);
    } else {
      query = query.eq('user_id', userId);
    }
    const { data } = await query;
    setNotifications(data || []);
  }, [userId, isAdmin, userName]);

  const deleteNotif = async (e, id) => {
    e.stopPropagation();
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (!error) setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    fetchNotifications();
    const channel = supabase.channel('notif-changes').on('postgres_changes', 
      { event: '*', schema: 'public', table: 'notifications' }, () => fetchNotifications()).subscribe();
    return () => supabase.removeChannel(channel);
  }, [fetchNotifications]);

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', color: 'white' }}>
        🔔 {notifications.length > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: '#ef4444', borderRadius: '10px', padding: '2px 6px', fontSize: '10px' }}>{notifications.length}</span>}
      </button>

      {isOpen && (
        <div className="notifications-list-container">
          <div className="notif-header">
            <strong>{t('Notificaciones')}</strong>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="notifications-scroll">
            {notifications.length === 0 ? <p className="no-notifications">{t('Sin novedades')}</p> :
              notifications.map(n => (
                <div key={n.id} className="notification-card">
                  <div>{n.message}</div>
                  <button className="notif-del-btn" onClick={(e) => deleteNotif(e, n.id)}>✕</button>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;