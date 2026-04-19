import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import NotificationBell from './NotificationBell.jsx';

function Header({ isActive, user, onLogout, isAdmin }) {
  const { t } = useTranslation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="header" style={{ 
      gridArea: 'header', display: 'flex', justifyContent: 'space-between', 
      alignItems: 'center', padding: '10px 25px', background: '#0b1120' 
    }}>
      <div className="logo-section">
        <h1 style={{ margin: 0, fontSize: '1.4rem', color: '#f8fafc', fontWeight: '700' }}>
          🖥️ InvenTI <span style={{ color: '#3b82f6' }}>Web</span>
        </h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {user && <NotificationBell userId={user.id} isAdmin={isAdmin} userName={user.name} />}

        <div className="status-indicator" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '6px 15px', borderRadius: '20px' }}>
          <div className={`status-dot ${!isActive ? 'inactive' : ''}`}></div>
          <span style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '600' }}>
            {isActive ? t('Sistema Activo') : t('Sistema Inactivo')}
          </span>
        </div>

        {user && (
          <div ref={menuRef} style={{ position: 'relative' }}>
            <div 
              className="user-profile-trigger" 
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '6px 15px', borderRadius: '20px' }}
            >
              <div className="user-dot"></div>
              <span style={{ color: '#f1f5f9', fontWeight: '500' }}>{user.name}</span>
            </div>
            {showUserMenu && (
              <div style={{ position: 'absolute', top: '50px', right: 0, background: '#1e293b', borderRadius: '12px', width: '200px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', overflow: 'hidden', zIndex: 1200 }}>
                <button onClick={onLogout} style={{ width: '100%', padding: '15px', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}>
                  🚪 {t('Cerrar Sesión')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;