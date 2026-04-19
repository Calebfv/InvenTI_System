// components.js

// Usamos 'useState' de React para que nuestros componentes puedan "recordar" cosas, como la lista de equipos o el texto de búsqueda.
const { useState, useEffect } = React;

// Esta es la configuración de estados que ya tenías, la usaremos en React.
const statusConfig = {
    operational: { label: 'Operativo', class: 'status-operational', color: '#22c55e' },
    warning: { label: 'En Mantenimiento', class: 'status-warning', color: '#f59e0b' },
    inactive: { label: 'Fuera de Servicio', class: 'status-inactive', color: '#ef4444' }
};

// =================================================================================
// COMPONENTE PARA UN ÚNICO EQUIPO (Nuestra "pieza de LEGO" reutilizable)
// =================================================================================
function EquipmentItem({ equipment }) {
    // Esto es JSX. Parece HTML, pero es JavaScript.
    // Recibe un 'equipment' y devuelve la estructura visual de ese equipo.
    return (
        <div className={`equipment-item ${statusConfig[equipment.status].class}`}>
            <div className="equipment-header">
                <div className="equipment-id">{equipment.id}</div>
                <div className={`status-badge ${statusConfig[equipment.status].class}`}>
                    {statusConfig[equipment.status].label}
                </div>
            </div>
            <div className="equipment-details">
                <strong>{equipment.name}</strong><br />
                📍 Ubicación: {equipment.location}<br />
                📅 Último mantenimiento: {formatDate(equipment.lastMaintenance)}<br />
                📝 Notas: {equipment.notes}
            </div>
            <div className="equipment-actions">
                {/* Estos botones ahora llaman a funciones globales que abren el modal */}
                <button className="btn-edit" onClick={() => editEquipment(equipment.id)}>✏️ Editar</button>
                <button className="btn-delete" onClick={() => deleteEquipment(equipment.id)}>🗑️ Eliminar</button>
            </div>
        </div>
    );
}

// =================================================================================
// COMPONENTE PRINCIPAL PARA LA GESTIÓN DE EQUIPOS
// =================================================================================
function EquipmentSection() {
    // 'useState' para guardar el estado de nuestros filtros y datos.
    // Cuando estos valores cambian, React automáticamente vuelve a dibujar la pantalla.
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [labFilter, setLabFilter] = useState('all');
    
    // Obtenemos los datos iniciales directamente de las variables globales de main.js
    const [allEquipment, setAllEquipment] = useState(equipmentData); 
    const [laboratoriesList, setLaboratoriesList] = useState(laboratories);

    // useEffect se ejecuta cuando el componente aparece en pantalla.
    // Lo usamos para "escuchar" cuando los datos en main.js cambian (ej. al agregar un equipo desde el modal).
    useEffect(() => {
        // Creamos un "escuchador" de eventos personalizado.
        const handleDataChange = () => {
            setAllEquipment([...equipmentData]); // Actualiza la lista de equipos en React
            setLaboratoriesList([...laboratories]); // Actualiza la lista de laboratorios en React
        };

        // Cuando los datos cambien en main.js (después de guardar/eliminar), notificaremos a React.
        window.addEventListener('dataUpdated', handleDataChange);

        // Limpieza: eliminamos el escuchador cuando el componente se desmonta.
        return () => {
            window.removeEventListener('dataUpdated', handleDataChange);
        };
    }, []); // El array vacío [] significa que este efecto solo se configura una vez.

    // Lógica de filtrado, ahora dentro de nuestro componente React.
    const filteredEquipment = allEquipment.filter(eq => {
        const matchSearch = eq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            eq.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchStatus = (statusFilter === 'all' || eq.status === statusFilter);
        const matchLab = (labFilter === 'all' || eq.category === labFilter);

        return matchSearch && matchStatus && matchLab;
    });

    // Renderizamos la UI completa de la sección de equipos.
    return (
        <div>
            <div className="section-header">
                <h2 className="section-title" id="equipos-title">💻 Gestión de Equipos (React)</h2>
                {/* Este botón sigue llamando a la función del modal que vive en main.js */}
                <button className="add-btn" id="add-equipment-btn-2" onClick={() => openModal()}>
                    ➕ Nuevo Equipo
                </button>
            </div>

            <div className="filters-bar" role="region" aria-label="Filtros de búsqueda y estado">
                <input 
                    type="text" 
                    placeholder="🔍 Buscar equipo..." 
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Cada vez que escribes, actualiza el estado 'searchTerm'.
                />
                
                <select 
                    className="filter-select"
                    value={labFilter}
                    onChange={(e) => setLabFilter(e.target.value)} // Al cambiar, actualiza 'labFilter'.
                >
                    <option value="all">Todos los laboratorios</option>
                    {laboratoriesList.map(lab => (
                        <option key={lab.id} value={lab.id}>{lab.name}</option>
                    ))}
                </select>
                
                <select 
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)} // Al cambiar, actualiza 'statusFilter'.
                >
                    <option value="all">Todos los estados</option>
                    <option value="operational">Operativos</option>
                    <option value="warning">En Mantenimiento</option>
                    <option value="inactive">Fuera de Servicio</option>
                </select>
            </div>

            <div className="equipment-list" id="equipment-list" tabIndex="0">
                {/* Hacemos un "map" sobre los datos filtrados. Por cada equipo, renderizamos un componente EquipmentItem. */}
                {filteredEquipment.length > 0 ? (
                    filteredEquipment.map(equipment => (
                        <EquipmentItem key={equipment.id} equipment={equipment} />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>No se encontraron equipos.</p>
                )}
            </div>
        </div>
    );
}

// =================================================================================
// RENDERIZADO DE LA APLICACIÓN REACT
// =================================================================================
// Buscamos el div que creamos en nuestro HTML.
const domNode = document.getElementById('react-equipment-root');
// Le decimos a React que renderice nuestro componente 'EquipmentSection' dentro de ese div.
const root = ReactDOM.createRoot(domNode);
root.render(<EquipmentSection />);