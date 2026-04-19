// Página Ajustes - Configuración del sistema
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

function AjustesPage({ userProfile, onLogout }) {
  const { t } = useTranslation();
  const [changeHistory, setChangeHistory] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [deletePassword, setDeletePassword] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [showAddProfileForm, setShowAddProfileForm] = useState(false);
  const [newProfile, setNewProfile] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    const savedHistory = localStorage.getItem('changeHistory');
    if (savedHistory) {
      setChangeHistory(JSON.parse(savedHistory));
    }

    const savedUsers = localStorage.getItem('inventi-users');
    if (savedUsers) {
      const users = JSON.parse(savedUsers);
      setRegisteredUsers(users.map(user => ({
        id: user.username,
        name: user.username,
        email: user.email,
        password: user.password
      })));
    }
  }, []);

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeletePassword('');
  };

  const confirmDeleteUser = () => {
    if (userToDelete.password && deletePassword !== userToDelete.password) {
      import('react-toastify').then(({ toast }) => {
        toast.error(t('Contraseña incorrecta'));
      });
      return;
    }
    const updatedUsers = registeredUsers.filter(u => u.id !== userToDelete.id);
    setRegisteredUsers(updatedUsers);
    const originalUsers = JSON.parse(localStorage.getItem('inventi-users') || '[]');
    const updatedOriginalUsers = originalUsers.filter(u => u.username !== userToDelete.id);
    localStorage.setItem('inventi-users', JSON.stringify(updatedOriginalUsers));
    addChangeToHistory('user_delete', 'Usuario eliminado: {{name}}', { name: userToDelete.name });
    if (window.addChangeToHistory) {
      window.addChangeToHistory('user_delete', 'Usuario eliminado: {{name}}', { name: userToDelete.name });
    }
    if (userProfile && userProfile.name === userToDelete.name) {
      onLogout();
    }
    setUserToDelete(null);
    import('react-toastify').then(({ toast }) => {
      toast.success(t('Usuario eliminado exitosamente'));
    });
  };

  const handleNewProfileChange = (e) => {
    const { name, value } = e.target;
    setNewProfile(prev => ({ ...prev, [name]: value }));
  };

  const addNewProfile = () => {
    const nameRegex = /^[a-zA-Z\s-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

    if (!newProfile.name || !newProfile.email || !newProfile.password) {
      import('react-toastify').then(({ toast }) => {
        toast.error(t('Nombre, correo electrónico y contraseña son obligatorios'));
      });
      return;
    }

    if (!nameRegex.test(newProfile.name)) {
      import('react-toastify').then(({ toast }) => {
        toast.error(t('El nombre solo puede contener letras, espacios y guiones'));
      });
      return;
    }

    if (!emailRegex.test(newProfile.email)) {
      import('react-toastify').then(({ toast }) => {
        toast.error(t('Correo electrónico no válido'));
      });
      return;
    }

    if (!passwordRegex.test(newProfile.password)) {
      import('react-toastify').then(({ toast }) => {
        toast.error(t('La contraseña debe tener al menos 6 caracteres, incluyendo letras y números'));
      });
      return;
    }

    const usernameExists = registeredUsers.some(user => user.name.toLowerCase() === newProfile.name.toLowerCase());
    if (usernameExists) {
      import('react-toastify').then(({ toast }) => {
        toast.error(t('El nombre de usuario ya está en uso'));
      });
      return;
    }

    const emailExists = registeredUsers.some(user => user.email.toLowerCase() === newProfile.email.toLowerCase());
    if (emailExists) {
      import('react-toastify').then(({ toast }) => {
        toast.error(t('El correo electrónico ya está en uso'));
      });
      return;
    }

    const newUser = {
      id: Date.now(),
      name: newProfile.name,
      email: newProfile.email,
      password: newProfile.password
    };
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    const originalUsers = JSON.parse(localStorage.getItem('inventi-users') || '[]');
    const updatedOriginalUsers = [...originalUsers, { username: newUser.name, email: newUser.email, password: newUser.password }];
    localStorage.setItem('inventi-users', JSON.stringify(updatedOriginalUsers));
    addChangeToHistory('user_add', 'Usuario agregado: {{name}}', { name: newUser.name });
    if (window.addChangeToHistory) {
      window.addChangeToHistory('user_add', 'Usuario agregado: {{name}}', { name: newUser.name });
    }
    setNewProfile({ name: '', email: '', password: '' });
    setShowAddProfileForm(false);
    import('react-toastify').then(({ toast }) => {
      toast.success(t('Usuario agregado exitosamente'));
    });
  };

  //Función para agregar cambios al historial (para ser llamada desde otros componentes)
  const addChangeToHistory = useCallback((type, key, params) => {
    const newChange = {
      id: Date.now(),
      type,
      key,
      params,
      timestamp: new Date().toLocaleString()
    };
    const updatedHistory = [newChange, ...changeHistory].slice(0, 10);
    setChangeHistory(updatedHistory);
    localStorage.setItem('changeHistory', JSON.stringify(updatedHistory));
  }, [changeHistory]);

  // Función para eliminar un cambio del historial
  const deleteChangeFromHistory = (changeId) => {
    const updatedHistory = changeHistory.filter(change => change.id !== changeId);
    setChangeHistory(updatedHistory);
    localStorage.setItem('changeHistory', JSON.stringify(updatedHistory));
  };

  // Exponer addChangeToHistory en la ventana para acceso global
  useEffect(() => {
    window.addChangeToHistory = addChangeToHistory;
    return () => {
      delete window.addChangeToHistory;
    };
  }, [changeHistory, addChangeToHistory]);

  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">⚙️ {t("Ajustes")}</h2>
      </div>

      {/* Usuarios registrados */}
      <div style={{
        marginTop: '20px',
        backgroundColor: '#1e293b',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 10px 30px rgba(34, 100, 156, 0.5)',
        color: '#cbd5e1'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ color: '#3b82f6', margin: 0 }}>{t("Usuarios Registrados")}</h3>
          <button
            onClick={() => setShowAddProfileForm(true)}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {t("Agregar Perfil")}
          </button>
        </div>
        {registeredUsers.length === 0 ? (
          <p>{t("No hay usuarios registrados.")}</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {registeredUsers.map(user => (
              <li key={user.id} style={{
                backgroundColor: '#374151',
                marginBottom: '10px',
                padding: '10px',
                borderRadius: '5px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>{user.name}</strong><br />
                  <small style={{ color: '#9ca3af' }}>{user.email}</small>
                </div>
                <button
                  onClick={() => handleDeleteUser(user)}
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  {t("Eliminar Usuario")}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Historial de cambios */}
      <div style={{
        marginTop: '20px',
        backgroundColor: '#1e293b',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 10px 30px rgba(34, 100, 156, 0.5)',
        color: '#cbd5e1'
      }}>
        <h3 style={{ color: '#3b82f6', marginBottom: '15px' }}>{t("Historial de Cambios")}</h3>
        {changeHistory.length === 0 ? (
          <p>{t("No hay cambios registrados aún.")}</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {changeHistory.map(change => (
              <li key={change.id} style={{
                backgroundColor: '#374151',
                marginBottom: '10px',
                padding: '10px',
                borderRadius: '5px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>{change.key ? t(change.key, change.params) : change.description}</strong><br />
                  <small style={{ color: '#9ca3af' }}>{change.timestamp}</small>
                </div>
                <button
                  onClick={() => deleteChangeFromHistory(change.id)}
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {t("Eliminar")}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Agregar perfil modal */}
      {showAddProfileForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0 10px 30px rgba(34, 100, 156, 0.5)',
            color: '#cbd5e1',
            maxWidth: '400px',
            width: '100%'
          }}>
            <h3 style={{ color: '#3b82f6', marginBottom: '15px' }}>{t("Agregar Perfil")}</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>{t("Nombre de Usuario")}:</label>
              <input
                type="text"
                name="name"
                value={newProfile.name}
                onChange={handleNewProfileChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #4b5563',
                  backgroundColor: '#374151',
                  color: '#cbd5e1'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>{t("Correo Electrónico")}:</label>
              <input
                type="email"
                name="email"
                value={newProfile.email}
                onChange={handleNewProfileChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #4b5563',
                  backgroundColor: '#374151',
                  color: '#cbd5e1'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>{t("Contraseña")}:</label>
              <input
                type="password"
                name="password"
                value={newProfile.password}
                onChange={handleNewProfileChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #4b5563',
                  backgroundColor: '#374151',
                  color: '#cbd5e1'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => setShowAddProfileForm(false)}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                {t("Cancelar")}
              </button>
              <button
                onClick={addNewProfile}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                {t("Agregar Perfil")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Eliminar modo de usuario */}
      {userToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0 10px 30px rgba(34, 100, 156, 0.5)',
            color: '#cbd5e1',
            maxWidth: '400px',
            width: '100%'
          }}>
            <h3 style={{ color: '#3b82f6', marginBottom: '15px' }}>{t("Confirmar Acción")}</h3>
            <p style={{ marginBottom: '15px' }}>
              {t("¿Está seguro de eliminar al usuario")} {userToDelete.name}?
            </p>
            {userToDelete.password && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>{t("Ingrese la contraseña para confirmar eliminación")}:</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #4b5563',
                    backgroundColor: '#374151',
                    color: '#cbd5e1'
                  }}
                />
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => setUserToDelete(null)}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                {t("Cancelar")}
              </button>
              <button
                onClick={confirmDeleteUser}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                {t("Confirmar")}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AjustesPage;
