// =================================================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// =================================================================================
let equipmentData = [];
let maintenanceData = [];
let laboratories = [];

let currentEditingId = null;
let currentEditingMaintenanceId = null;
let chartInstances = {}; 

// Sincronizado con la Base de Datos
const statusConfig = {
    'Activo': { label: 'Activo', class: 'status-operational', color: '#22c55e' },
    'En Mantenimiento': { label: 'En Mantenimiento', class: 'status-warning', color: '#f59e0b' },
    'Fuera de Servicio': { label: 'Fuera de Servicio', class: 'status-inactive', color: '#ef4444' }
};

// =================================================================================
// ARRANQUE Y GESTIÓN DE DATOS
// =================================================================================
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    console.log('Initializing app...');
    loadDataFromStorage();
    setupEventListeners();
    updateUI(); 
    
    // Vista por defecto
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById('dashboard-section').classList.add('active');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector('.nav-link[data-section="dashboard"]').classList.add('active');
    updateSystemStatus(true); 
}

function updateSystemStatus(isActive) {
    const statusDot = document.getElementById('system-status-dot');
    const statusText = document.getElementById('system-status-text');
    if (!statusDot || !statusText) return;
    
    if (isActive) {
        statusDot.classList.remove('inactive');
        statusText.textContent = 'Sistema Activo';
    } else {
        statusDot.classList.add('inactive');
        statusText.textContent = 'Sistema Inactivo';
    }
}

function updateUI() {
    renderDashboardLaboratories();
    renderLocationOptions();
    updateDashboard();
    renderMaintenanceList();
    updateReportsData();
    updateMaintenanceEquipmentOptions();
}

function loadDataFromStorage() {
    const storedLabs = localStorage.getItem('inventi-labs');
    laboratories = storedLabs ? JSON.parse(storedLabs) : [
        { id: 'informatica', name: 'Informática' },
        { id: 'contabilidad', name: 'Contabilidad' },
        { id: 'secretariado', name: 'Secretariado' }
    ];

    const storedEq = localStorage.getItem('inventi-equipment');
    if (storedEq) {
        equipmentData = JSON.parse(storedEq);
    } else {
        // Datos iniciales de prueba (Blueprints corregidos a nuevos estados)
        const defaultEquipment = [
            { id: 'PC-001', name: 'Computadora de Escritorio', status: 'Activo', notes: 'Último mantenimiento: 15/05/2025' },
            { id: 'LT-003', name: 'Laptop Dell', status: 'En Mantenimiento', notes: 'Revisión de software' },
            { id: 'PR-005', name: 'Impresora HP', status: 'Fuera de Servicio', notes: 'Falla mecánica grave' }
        ];
        equipmentData = defaultEquipment.map(eq => ({
            ...eq,
            location: laboratories[0].name,
            category: laboratories[0].id,
            lastMaintenance: '2025-01-01'
        }));
    }
    
    const storedMt = localStorage.getItem('inventi-maintenance');
    maintenanceData = storedMt ? JSON.parse(storedMt) : [];
}

function saveDataToStorage() {
    localStorage.setItem('inventi-equipment', JSON.stringify(equipmentData));
    localStorage.setItem('inventi-maintenance', JSON.stringify(maintenanceData));
    localStorage.setItem('inventi-labs', JSON.stringify(laboratories));
    window.dispatchEvent(new Event('dataUpdated'));
}

// =================================================================================
// MANEJADORES DE EVENTOS
// =================================================================================
function setupEventListeners() {
    document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', handleNavigation));
    document.getElementById('add-lab-btn').addEventListener('click', openLabModal);
    document.getElementById('generate-overall-report-btn').addEventListener('click', generateOverallExcelReport);
    document.getElementById('equipment-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('lab-form').addEventListener('submit', handleLabFormSubmit);
    document.getElementById('maintenance-form').addEventListener('submit', handleMaintenanceSubmit);
    
    // Cierre de modales
    document.querySelectorAll('.close-modal-btn, .cancel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
        });
    });
}

// =================================================================================
// RENDERIZADO Y DASHBOARD
// =================================================================================
function updateDashboard() {
    const counts = {
        operational: equipmentData.filter(eq => eq.status === 'Activo').length,
        warning: equipmentData.filter(eq => eq.status === 'En Mantenimiento').length,
        inactive: equipmentData.filter(eq => eq.status === 'Fuera de Servicio').length
    };
    
    const opElem = document.getElementById('operational-count');
    const waElem = document.getElementById('warning-count');
    const inElem = document.getElementById('inactive-count');

    if (opElem) opElem.textContent = counts.operational;
    if (waElem) waElem.textContent = counts.warning;
    if (inElem) inElem.textContent = counts.inactive;
}

function renderEquipmentListByCategory(fullId) {
    const container = document.getElementById(fullId);
    const categoryId = fullId.replace('equipos-', '');
    const filtered = equipmentData.filter(eq => eq.category === categoryId);
    container.innerHTML = '';
    
    if (filtered.length === 0) {
        container.innerHTML = '<p style="color:#888; padding: 10px 0;">No hay equipos en esta categoría.</p>';
        return;
    }
    
    filtered.forEach(eq => {
        const config = statusConfig[eq.status] || { label: eq.status, class: 'status-unknown' };
        const div = document.createElement('div');
        div.className = `equipment-item ${config.class}`;
        div.innerHTML = `
            <div class="equipment-header">
                <div class="equipment-id">${eq.id}</div>
                <div class="status-badge ${config.class}">${config.label}</div>
            </div>
            <div class="equipment-details">
                <strong>${eq.name}</strong><br>
                📍 ${eq.location}
            </div>
        `;
        container.appendChild(div);
    });
}

function renderDashboardLaboratories() {
    const container = document.getElementById('laboratories-container');
    if(!container) return;
    container.innerHTML = '';
    
    laboratories.forEach(lab => {
        const count = equipmentData.filter(eq => eq.category === lab.id).length;
        const div = document.createElement('div');
        div.className = 'lab-card-container';
        div.innerHTML = `
            <button class="category-btn" onclick="toggleEquipment('equipos-${lab.id}')">
                <div class="lab-btn-content">
                    <span class="lab-btn-icon">🖥️</span>
                    <span class="lab-btn-name">${lab.name}</span>
                </div>
                <span class="lab-btn-count">${count} equipos</span>
            </button>
            <button class="lab-delete-btn" onclick="deleteLaboratory('${lab.id}')">🗑️</button>
        `;
        const detailsDiv = document.createElement('div');
        detailsDiv.id = `equipos-${lab.id}`;
        detailsDiv.className = 'equipment-details';
        detailsDiv.hidden = true;
        container.appendChild(div);
        container.appendChild(detailsDiv);
    });
}

// =================================================================================
// REPORTES
// =================================================================================
function updateReportsData() {
    const stats = {
        total: equipmentData.length,
        op: equipmentData.filter(eq => eq.status === 'Activo').length,
        warn: equipmentData.filter(eq => eq.status === 'En Mantenimiento').length,
        inac: equipmentData.filter(eq => eq.status === 'Fuera de Servicio').length
    };

    const setVal = (id, val) => { if(document.getElementById(id)) document.getElementById(id).textContent = val; };
    
    setVal('reports-total', stats.total);
    setVal('reports-operational', stats.op);
    setVal('reports-warning', stats.warn);
    setVal('reports-inactive', stats.inac);
    
    const health = stats.total > 0 ? Math.round((stats.op / stats.total) * 100) : 0;
    setVal('reports-health', `${health}%`);

    renderReportChart('report-chart', stats);
    renderLabReports();
}

function renderReportChart(canvasId, stats) {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;
    if (chartInstances[canvasId]) chartInstances[canvasId].destroy();

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Activos', 'Mantenimiento', 'Fuera de Servicio'],
            datasets: [{
                data: [stats.op, stats.warn, stats.inac],
                backgroundColor: [statusConfig['Activo'].color, statusConfig['En Mantenimiento'].color, statusConfig['Fuera de Servicio'].color]
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

// --- FUNCIONES DE APOYO ---
function toggleEquipment(id) {
    const el = document.getElementById(id);
    if(el) {
        el.hidden = !el.hidden;
        if(!el.hidden) renderEquipmentListByCategory(id);
    }
}

function handleNavigation(e) {
    e.preventDefault();
    const section = e.currentTarget.getAttribute('data-section');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    e.currentTarget.classList.add('active');
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`${section}-section`).classList.add('active');
}

function showNotification(msg, type = 'success') {
    const n = document.createElement('div');
    n.className = `notification notification-${type} show`;
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 300); }, 3000);
}

// (Otras funciones de formularios se mantienen igual pero usando los filtros actualizados)