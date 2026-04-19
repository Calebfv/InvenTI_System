import { supabase } from './supabaseClient';

// --- EQUIPOS ---
export const getEquipment = async () => {
  const { data, error } = await supabase.from('equipment').select('*');
  if (error) throw error;
  return data;
};

export const addEquipment = async (equipment) => {
  const { data, error } = await supabase.from('equipment').insert([equipment]).select();
  if (error) throw error;
  return data[0];
};

export const updateEquipment = async (id, equipment) => {
  const { data, error } = await supabase.from('equipment').update(equipment).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteEquipment = async (id) => {
  const { error } = await supabase.from('equipment').delete().eq('id', id);
  if (error) throw error;
};

// --- LABORATORIOS ---
export const getLabs = async () => {
  const { data, error } = await supabase.from('labs').select('*');
  if (error) throw error;
  return data;
};

export const addLab = async (lab) => {
  const { data, error } = await supabase.from('labs').insert([lab]).select();
  if (error) throw error;
  return data[0];
};

export const deleteLab = async (id) => {
  const { error } = await supabase.from('labs').delete().eq('id', id);
  if (error) throw error;
};

// --- MANTENIMIENTO ---
export const addMaintenance = async (m) => {
  const { data, error } = await supabase.from('maintenance').insert([m]).select();
  if (error) throw error;
  return data[0];
};

export const updateMaintenance = async (id, m) => {
  const { data, error } = await supabase.from('maintenance').update(m).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteMaintenance = async (id) => {
  const { error } = await supabase.from('maintenance').delete().eq('id', id);
  if (error) throw error;
};

// --- SISTEMA DE AUDITORÍA (CORREGIDO) ---
export const logAuthActivity = async (activity, details = {}) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const email = details.email || session?.user?.email || 'Sistema';
    const userId = details.user_id || session?.user?.id || null;

    const { error } = await supabase.from('audit_logs').insert([
      {
        activity,
        details, 
        user_email: email, 
        user_id: userId,  
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString() // IMPORTANTE: Enviar siempre
      }
    ]);
    if (error) throw error;
  } catch (error) {
    console.error('Error log:', error);
  }
};

export const getAuditLogs = async () => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('timestamp', { ascending: false });
  return error ? [] : data;
};

export const getSecurityStats = async () => {
  try {
    const { data: logs } = await supabase.from('audit_logs').select('*');
    const allLogs = logs || [];
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    return {
      total_users: new Set(allLogs.map(l => l.user_email).filter(Boolean)).size,
      successful_logins: allLogs.filter(l => l.activity === 'login_success').length,
      failed_logins: allLogs.filter(l => l.activity === 'login_failed').length,
      active_sessions: allLogs.filter(l => l.activity === 'login_success' && new Date(l.timestamp) >= oneDayAgo).length
    };
  } catch (e) {
    return { total_users: 0, successful_logins: 0, failed_logins: 0, active_sessions: 0 };
  }
};