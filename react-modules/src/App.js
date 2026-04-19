import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from './supabaseClient';
import './App.css';

// Componentes UI
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Footer from './components/Footer.jsx';
import Modal from './components/Modal.jsx';
import ConfirmationDialog from './components/ConfirmationDialog.jsx';
import EquipmentForm from './components/EquipmentForm.jsx';
import LabForm from './components/LabForm.jsx';
import MaintenanceForm from './components/MaintenanceForm.jsx';
import TicketForm from './components/TicketForm.jsx'; 
import ErrorBoundary from './components/ErrorBoundary.jsx';

// API Functions
import { 
  addEquipment, updateEquipment, deleteEquipment, 
  addLab, deleteLab, 
  addMaintenance, updateMaintenance, deleteMaintenance,
  logAuthActivity 
} from './api.js';

// Lazy Loading de Páginas
const EquipmentPage = lazy(() => import('./pages/EquipmentPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const AyudaPage = lazy(() => import('./pages/AyudaPage.jsx'));
const AjustesPage = lazy(() => import('./pages/AjustesPage.jsx'));
const MaintenancePage = lazy(() => import('./pages/MaintenancePage.jsx'));
const ReportesPage = lazy(() => import('./pages/ReportesPage.jsx'));
const AuditLogsPage = lazy(() => import('./pages/AuditLogsPage.jsx'));
const TicketsPage = lazy(() => import('./pages/TicketsPage.jsx'));

// --- FORMULARIO DE LOGIN (DISEÑO RESTAURADO) ---
const LoginForm = ({ onLogin, onRegister }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const email = username.includes('@') ? username : `${username}@inventi.com`;
    
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      await logAuthActivity('login_failed', { email, error: authError.message });
      setError(t('Credenciales incorrectas'));
    } else {
      await logAuthActivity('login_success', { email, user_id: data.user.id });
      const profileName = data.user.user_metadata?.display_name || data.user.email.split('@')[0];
      onLogin({ id: data.user.id, name: profileName, email: data.user.email });
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', padding: '40px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)', width: '400px', textAlign: 'center', border: '1px solid rgba(71, 85, 105, 0.3)' }}>
        <h1 style={{ color: '#cbd5e1', margin: '0 0 10px 0', fontSize: '28px' }}>🖥️ InvenTI Web</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input type="text" placeholder={t('Usuario')} value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(71, 85, 105, 0.5)', backgroundColor: 'rgba(30, 41, 59, 0.8)', color: '#cbd5e1' }} required />
          <input type="password" placeholder={t('Contraseña')} value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(71, 85, 105, 0.5)', backgroundColor: 'rgba(30, 41, 59, 0.8)', color: '#cbd5e1' }} required />
          {error && <p style={{ color: '#ef4444', margin: 0 }}>{error}</p>}
          <button type="submit" style={{ padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{t('Iniciar Sesión')}</button>
        </form>
        <button onClick={onRegister} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '14px' }}>{t('¿No tienes cuenta? Regístrate')}</button>
      </div>
    </div>
  );
};

// --- FORMULARIO DE REGISTRO (DISEÑO RESTAURADO) ---
const RegisterForm = ({ onBack }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error: regError } = await supabase.auth.signUp({
      email, password, options: { data: { display_name: username } }
    });
    
    if (regError) {
      await logAuthActivity('register_failed', { email, error: regError.message });
      setError(regError.message);
    } else {
      await logAuthActivity('register_success', { email, user_id: data.user?.id });
      alert(t("Registro exitoso. Revisa tu email.")); 
      onBack(); 
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', padding: '40px', borderRadius: '20px', width: '400px', textAlign: 'center', border: '1px solid rgba(71, 85, 105, 0.3)' }}>
        <h1 style={{ color: '#cbd5e1', marginBottom: '20px' }}>📝 {t('Crear Cuenta')}</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#1e293b', color: 'white' }} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#1e293b', color: 'white' }} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#1e293b', color: 'white' }} required />
          {error && <p style={{ color: '#ef4444' }}>{error}</p>}
          <button type="submit" style={{ padding: '12px', backgroundColor: '#10b981', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', border: 'none' }}>{t('Registrarse')}</button>
        </form>
        <button onClick={onBack} style={{ marginTop: '20px', color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer' }}>{t('Volver')}</button>
      </div>
    </div>
  );
};

function App() {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userRole, setUserRole] = useState('user'); 
  const [showRegister, setShowRegister] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [equipment, setEquipment] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [maintenanceData, setMaintenanceData] = useState([]);

  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [reportingEquipment, setReportingEquipment] = useState(null);
  const [confirmation, setConfirmation] = useState({ isOpen: false, message: '', onConfirm: () => {} });

  const isAdmin = userRole === 'admin';

  const loadAllData = useCallback(async () => {
    if (!userProfile) return;
    try {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', userProfile.id).single();
      const currentRole = profile?.role || 'user';
      setUserRole(currentRole);

      let finalLabs = [];
      let finalEq = [];

      if (currentRole === 'admin') {
        const { data: l } = await supabase.from('labs').select('*');
        const { data: e } = await supabase.from('equipment').select('*');
        finalLabs = l || [];
        finalEq = e || [];
      } else {
        const { data: perms } = await supabase.from('user_lab_permissions').select('lab_id, labs(*)').eq('user_id', userProfile.id);
        finalLabs = perms ? perms.map(p => p.labs).filter(Boolean) : [];
        const labIds = finalLabs.map(l => l.id);
        const { data: e } = await supabase.from('equipment').select('*').in('laboratoryId', labIds);
        finalEq = e || [];
      }
      setLaboratories(finalLabs);
      setEquipment(finalEq);
      const { data: maint } = await supabase.from('maintenance').select('*');
      setMaintenanceData(maint || []);
    } catch (err) { console.error("Error cargando datos:", err); }
  }, [userProfile]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserProfile({ 
          id: session.user.id,
          name: session.user.user_metadata?.display_name || session.user.email.split('@')[0], 
          email: session.user.email 
        });
        setIsLoggedIn(true);
      }
      setIsLoadingAuth(false);
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (isLoggedIn) loadAllData();
  }, [isLoggedIn, loadAllData]);

  const handleLogout = async () => {
    if (userProfile) await logAuthActivity('logout', { email: userProfile.email });
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserProfile(null);
    setUserRole('user');
  };

  const handleDeleteRequest = (id, type) => {
    setConfirmation({
      isOpen: true,
      message: t(`¿Estás seguro de que deseas eliminar este ${type}?`),
      onConfirm: async () => {
        try {
          if (type === 'equipo') {
            const equipmentToDelete = equipment.find(eq => eq.id === id);
            await deleteEquipment(id);
            await logAuthActivity('equipment_deleted', { equipment_id: id, equipment_name: equipmentToDelete?.name });
          } else if (type === 'laboratorio') {
            const labToDelete = laboratories.find(lab => lab.id === id);
            await deleteLab(id);
            await logAuthActivity('lab_deleted', { lab_id: id, lab_name: labToDelete?.name });
          } else if (type === 'mantenimiento') {
            await deleteMaintenance(id);
            await logAuthActivity('maintenance_deleted', { maintenance_id: id });
          }
          loadAllData();
          setConfirmation({ isOpen: false, message: '', onConfirm: () => {} });
        } catch (error) { console.error('Error deleting item:', error); }
      }
    });
  };

  const handleSaveEquipment = async (formData) => {
    try {
      if (editingEquipment) {
        await updateEquipment(editingEquipment.id, formData);
        await logAuthActivity('equipment_updated', { equipment_id: editingEquipment.id, equipment_name: formData.name });
      } else {
        const newEquipment = await addEquipment(formData);
        await logAuthActivity('equipment_created', { equipment_id: newEquipment.id, equipment_name: formData.name });
      }
      loadAllData();
      setIsEquipmentModalOpen(false);
    } catch (error) { console.error('Error saving equipment:', error); }
  };

  const handleSaveMaintenance = async (formData) => {
    try {
      if (editingMaintenance) {
        await updateMaintenance(editingMaintenance.id, formData);
        await logAuthActivity('maintenance_updated', { maintenance_id: editingMaintenance.id });
      } else {
        const newMaint = await addMaintenance(formData);
        const foundEquipment = equipment.find(eq => eq.id === formData.equipmentId);
        await logAuthActivity('maintenance_created', { maintenance_id: newMaint.id, equipment_id: formData.equipmentId, equipment_name: foundEquipment?.name });
      }
      loadAllData();
      setIsMaintenanceModalOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleSaveTicket = async (ticketData) => {
    try {
      const code = `TK-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      const { data, error } = await supabase.from('tickets').insert([{
        equipment_id: ticketData.equipment_id,
        common_issues: ticketData.common_issues,
        comments: ticketData.comments,
        ticket_code: code,
        reported_by: userProfile.id,
        status: 'Pendiente'
      }]).select();

      if (!error && data) {
        // Obtener el nombre del equipo
        const equipmentInfo = equipment.find(eq => eq.id === ticketData.equipment_id);
        const equipmentName = equipmentInfo?.name || 'Equipo desconocido';
        
        await logAuthActivity('ticket_created', { 
          ticket_id: data[0].id, 
          ticket_code: code, 
          equipment_id: ticketData.equipment_id,
          equipment_name: equipmentName
        });
        await supabase.from('equipment').update({ status: 'En Mantenimiento' }).eq('id', ticketData.equipment_id);
        setIsTicketModalOpen(false);
        loadAllData();
      }
    } catch (error) { console.error('Error creating ticket:', error); }
  };

  if (isLoadingAuth) {
    return <div style={{ background: '#0f172a', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{t('Cargando...')}</div>;
  }

  if (!isLoggedIn) {
    return showRegister ? 
      <RegisterForm onBack={() => setShowRegister(false)} /> : 
      <LoginForm onLogin={(p) => {setUserProfile(p); setIsLoggedIn(true);}} onRegister={() => setShowRegister(true)} />;
  }

  return (
    <div className="app-container">
      <Header isActive={isLoggedIn} user={userProfile} onLogout={handleLogout} />
      <Sidebar onSectionChange={setActiveSection} activeSection={activeSection} isAdmin={isAdmin} />
      <main className="content">
        <ErrorBoundary>
          <Suspense fallback={<div>{t('Cargando...')}</div>}>
            {activeSection === 'dashboard' && (
              <DashboardPage 
                allEquipment={equipment} 
                allLabs={laboratories} 
                isAdmin={isAdmin} 
                currentUser={{ ...userProfile, role: userRole }} 
                onOpenLabModal={() => setIsLabModalOpen(true)}
                onDeleteLab={(id) => handleDeleteRequest(id, 'laboratorio')}
              />
            )}
            {activeSection === 'equipos' && <EquipmentPage allEquipment={equipment} allLabs={laboratories} onOpenAddModal={() => {setEditingEquipment(null); setIsEquipmentModalOpen(true);}} onOpenEditModal={(eq) => {setEditingEquipment(eq); setIsEquipmentModalOpen(true);}} onDeleteEquipment={(id) => handleDeleteRequest(id, 'equipo')} onReportTicket={(eq) => {setReportingEquipment(eq); setIsTicketModalOpen(true);}} isAdmin={isAdmin} />}
            {activeSection === 'mantenimiento' && <MaintenancePage maintenanceList={maintenanceData} equipmentList={equipment} onOpenAddModal={() => {setEditingMaintenance(null); setIsMaintenanceModalOpen(true);}} onOpenEditModal={(m) => {setEditingMaintenance(m); setIsMaintenanceModalOpen(true);}} onDelete={(id) => handleDeleteRequest(id, 'mantenimiento')} isAdmin={isAdmin} />}
            {activeSection === 'reportes' && <ReportesPage allEquipment={equipment} allLabs={laboratories} />}
            {activeSection === 'auditoria' && isAdmin && <AuditLogsPage />}
            {activeSection === 'tickets' && <TicketsPage isAdmin={isAdmin} userProfile={userProfile} />}
            {activeSection === 'ajustes' && <AjustesPage userProfile={userProfile} onLogout={handleLogout} />}
            {activeSection === 'ayuda' && <AyudaPage equipment={equipment} maintenanceData={maintenanceData} />}
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />

      <Modal isOpen={isEquipmentModalOpen} onClose={() => setIsEquipmentModalOpen(false)} title={t("Equipo")}>
        <EquipmentForm onSave={handleSaveEquipment} onCancel={() => setIsEquipmentModalOpen(false)} initialData={editingEquipment} labs={laboratories} />
      </Modal>

      <Modal isOpen={isMaintenanceModalOpen} onClose={() => setIsMaintenanceModalOpen(false)} title={t("Mantenimiento")}>
        <MaintenanceForm onSave={handleSaveMaintenance} onCancel={() => setIsMaintenanceModalOpen(false)} initialData={editingMaintenance} equipmentList={equipment} />
      </Modal>

      <Modal isOpen={isLabModalOpen} onClose={() => setIsLabModalOpen(false)} title={t("Laboratorio")}>
        <LabForm 
          onSave={async (labName) => {
            const newLab = await addLab({ name: labName });
            await logAuthActivity('lab_created', { lab_id: newLab.id, lab_name: labName });
            loadAllData();
            setIsLabModalOpen(false);
          }}
          onCancel={() => setIsLabModalOpen(false)} 
        />
      </Modal>

      <Modal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} title={t("Reportar Falla")}>
        <TicketForm equipment={reportingEquipment} onSave={handleSaveTicket} onCancel={() => setIsTicketModalOpen(false)} />
      </Modal>

      <Modal isOpen={confirmation.isOpen} onClose={() => setConfirmation({...confirmation, isOpen: false})} title={t("Confirmar")}>
        <ConfirmationDialog message={confirmation.message} onConfirm={confirmation.onConfirm} onCancel={() => setConfirmation({...confirmation, isOpen: false})} />
      </Modal>
    </div>
  );
}

export default App;