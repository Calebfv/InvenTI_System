import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Recursos de traducción - Solo Español
const resources = {
  es: {
    translation: {
      // Header
      "Sistema de Inventario": "Sistema de Inventario",
      "Sistema Activo": "Sistema Activo",
      "Sistema Inactivo": "Sistema Inactivo",

      // Sidebar
      "Menú Principal": "Menú Principal",
      "Dashboard": "Dashboard",
      "Equipos": "Equipos",
      "Mantenimiento": "Mantenimiento",
      "Reportes": "Reportes",
      "Ajustes": "Ajustes",
      "Ayuda": "Ayuda",
      "Auditoría": "Auditoría",
      "Tickets": "Tickets",

      // Dashboard & Etiquetas de Estado
      "Laboratorios": "Laboratorios",
      "Nuevo Laboratorio": "Nuevo Laboratorio",
      "Equipos Operativos": "Equipos Operativos",
      "En Mantenimiento": "En Mantenimiento", 
      "Fuera de Servicio": "Fuera de Servicio",
      "Requiere Atención": "En Mantenimiento",

      // Equipos
      "Gestión de Equipos": "Gestión de Equipos",
      "Nuevo Equipo": "Nuevo Equipo",
      "Buscar equipo...": "Buscar equipo...",
      "Todos los laboratorios": "Todos los laboratorios",
      "Todos los estados": "Todos los estados",

      // Mantenimiento
      "Gestión de Mantenimiento": "Gestión de Mantenimiento",
      "Agregar Mantenimiento": "Agregar Mantenimiento",
      "No hay registros de mantenimiento aún.": "No hay registros de mantenimiento aún.",

      // Reportes
      "Reportes y Estadísticas": "Reportes y Estadísticas",
      "Generar Informe General en Excel": "Generar Informe General en Excel",
      "Generar Informe": "Generar Informe",
      "Estado General del Inventario": "Estado General del Inventario",
      "Atención": "Atención",
      "Inactivos": "Inactivos",
      "equipos": "equipos",
      "Puntaje de salud": "Puntaje de salud",
      "ID del Equipo": "ID del Equipo",
      "Nombre": "Nombre",
      "Ubicación": "Ubicación",
      "Estado": "Estado",
      "Notas": "Notas",
      "Último Mantenimiento": "Último Mantenimiento",
      "N/A": "N/A",
      "software_outdated": "Software desactualizado",
      "mechanical_failure": "Falla mecánica",
      "rgb_maximum": "RGB al máximo",
      "Resumen general de todo el inventario.": "Resumen general de todo el inventario.",
      "Total de equipos": "Total de equipos",
      "Nº de Equipos": "Nº de Equipos",
      "Informe generado exitosamente": "Informe generado exitosamente",
      "No hay equipos en": "No hay equipos en",
      "para generar un informe.": "para generar un informe.",
      "Reporte_Inventario": "Reporte_Inventario",
      "Reporte_General_Inventario.xlsx": "Reporte_General_Inventario.xlsx",

      // Ajustes
      "Perfil de Usuario": "Perfil de Usuario",
      "Nombre de Usuario": "Nombre de Usuario",
      "Correo Electrónico": "Correo Electrónico",
      "Contraseña": "Contraseña",
      "Guardar Perfil": "Guardar Perfil",
      "Historial de Cambios": "Historial de Cambios",
      "No hay cambios registrados aún.": "No hay cambios registrados aún.",
      "Perfil actualizado exitosamente": "Perfil actualizado exitosamente",
      "Iniciar Sesión": "Iniciar Sesión",
      "Cerrar Sesión": "Cerrar Sesión",
      "Usuario": "Usuario",
      "Equipo agregado": "Equipo agregado",
      "Equipo eliminado": "Equipo eliminado",
      "Laboratorio agregado": "Laboratorio agregado",
      "Laboratorio eliminado": "Laboratorio eliminado",
      "Mantenimiento agregado": "Mantenimiento agregado",
      "Mantenimiento eliminado": "Mantenimiento eliminado",
      "Usuarios Registrados": "Usuarios Registrados",
      "Eliminar Usuario": "Eliminar Usuario",
      "Ingrese la contraseña para confirmar eliminación": "Ingrese la contraseña para confirmar eliminación",
      "Usuario eliminado exitosamente": "Usuario eliminado exitosamente",
      "Contraseña incorrecta": "Contraseña incorrecta",
      "¿Está seguro de eliminar al usuario": "¿Está seguro de eliminar al usuario",
      "Agregar Perfil": "Agregar Perfil",
      "Usuario agregado exitosamente": "Usuario agregado exitosamente",
      "Nombre y correo electrónico son obligatorios": "Nombre y correo electrónico son obligatorios",
      "El nombre de usuario ya está en uso": "El nombre de usuario ya está en uso",
      "El correo electrónico ya está en uso": "El correo electrónico ya está en uso",
      "El nombre solo puede contener letras, espacios y guiones": "El nombre solo puede contener letras, espacios y guiones",
      "Correo electrónico no válido": "Correo electrónico no válido",
      "La contraseña debe tener al menos 6 caracteres, incluyendo letras y números": "La contraseña debe tener al menos 6 caracteres, incluyendo letras y números",
      "No hay usuarios registrados.": "No hay usuarios registrados.",
      "Eliminar": "Eliminar",
      "Confirmar Acción": "Confirmar Acción",
      "Confirmar": "Confirmar",
      "Cancelar": "Cancelar",
      "Volver": "Volver",
      "¿No tienes cuenta? Regístrate": "¿No tienes cuenta? Regístrate",
      "Registro exitoso. Revisa tu email.": "Registro exitoso. Revisa tu email.",
      "Crear Cuenta": "Crear Cuenta",
      "Registrarse": "Registrarse",

      // Ayuda
      "Sistema de Ayuda": "Sistema de Ayuda",
      "Preguntas Frecuentes": "Preguntas Frecuentes",
      "¿Cómo agregar un nuevo equipo?": "¿Cómo agregar un nuevo equipo?",
      "Para agregar un nuevo equipo, ve a la sección \"Equipos\" y haz clic en \"Agregar Equipo\". Completa el formulario y guarda los datos.": "Para agregar un nuevo equipo, ve a la sección \"Equipos\" y haz clic en \"Agregar Equipo\". Completa el formulario y guarda los datos.",
      "¿Cómo registrar un mantenimiento?": "¿Cómo registrar un mantenimiento?",
      "Para registrar un mantenimiento, ve a la sección \"Mantenimiento\" y haz clic en \"Agregar Mantenimiento\". Completa el formulario y guarda los datos.": "Para registrar un mantenimiento, ve a la sección \"Mantenimiento\" y haz clic en \"Agregar Mantenimiento\". Completa el formulario y guarda los datos.",
      "¿Cómo generar un reporte?": "¿Cómo generar un reporte?",
      "Para generar un reporte, ve a la sección \"Reportes\" y haz clic en \"Generar Informe\".": "Para generar un reporte, ve a la sección \"Reportes\" y haz clic en \"Generar Informe\".",
      "¿Qué significan los colores de estado?": "¿Qué significan los colores de estado?",
      "Los colores de estado significan: Verde: Operativo, Amarillo: En Mantenimiento, Rojo: Fuera de servicio.": "Los colores de estado significan: Verde: Operativo, Amarillo: En Mantenimiento, Rojo: Fuera de servicio.",

      // Forms
      "ID del Equipo:": "ID del Equipo:",
      "Nombre del Equipo:": "Nombre del Equipo:",
      "Ubicación (Laboratorio):": "Ubicación (Laboratorio):",
      "Estado:": "Estado:",
      "Operativo": "Operativo",
      "Notas:": "Notas:",
      "El ID y el Nombre del equipo son obligatorios.": "El ID y el Nombre del equipo son obligatorios.",
      "No hay laboratorios": "No hay laboratorios",
      "Nombre del Laboratorio:": "Nombre del Laboratorio:",
      "Ej: Laboratorio de Redes": "Ej: Laboratorio de Redes",
      "El nombre del laboratorio no puede estar vacío.": "El nombre del laboratorio no puede estar vacío.",
      "Equipo:": "Equipo:",
      "Fecha:": "Fecha:",
      "Detalles del mantenimiento": "Detalles del mantenimiento",
      "La fecha es requerida.": "La fecha es requerida.",
      "No se pueden asignar mantenimientos para fechas anteriores a la actual.": "No se pueden asignar mantenimientos para fechas anteriores a la actual.",
      "Debe seleccionar un equipo y una fecha.": "Debe seleccionar un equipo y una fecha.",
      "No hay equipos": "No hay equipos",
      "Editar Equipo": "Editar Equipo",
      "Agregar Nuevo Equipo": "Agregar Nuevo Equipo",
      "Agregar Nuevo Laboratorio": "Agregar Nuevo Laboratorio",
      "Editar Registro": "Editar Registro",
      "Agregar Registro de Mantenimiento": "Agregar Registro de Mantenimiento",
      "Cerrar modal": "Cerrar modal",
      "Eliminar laboratorio": "Eliminar laboratorio",
      "No hay equipos en esta categoría.": "No hay equipos en esta categoría.",
      "Filtros de búsqueda y estado": "Filtros de búsqueda y estado",

      // App messages
      "¿Está seguro de eliminar este equipo?": "¿Está seguro de eliminar este equipo?",
      "Equipo eliminado exitosamente": "Equipo eliminado exitosamente",
      "Ya existe un laboratorio con ese nombre.": "Ya existe un laboratorio con ese nombre.",
      "Laboratorio agregado exitosamente": "Laboratorio agregado exitosamente",
      "¿Eliminar el laboratorio": "¿Eliminar el laboratorio",
      "? ¡Se borrarán también todos sus equipos!": "? ¡Se borrarán también todos sus equipos!",
      "Laboratorio eliminado exitosamente": "Laboratorio eliminado exitosamente",
      "Registro actualizado exitosamente": "Registro actualizado exitosamente",
      "Mantenimiento agregado exitosamente": "Mantenimiento agregado exitosamente",
      "¿Eliminar este registro de mantenimiento?": "¿Eliminar este registro de mantenimiento?",
      "Registro eliminado exitosamente": "Registro eliminado exitosamente",
      "¿Estás seguro de que deseas eliminar este equipo?": "¿Estás seguro de que deseas eliminar este equipo?",
      "¿Estás seguro de que deseas eliminar este laboratorio?": "¿Estás seguro de que deseas eliminar este laboratorio?",
      "¿Estás seguro de que deseas eliminar este mantenimiento?": "¿Estás seguro de que deseas eliminar este mantenimiento?",
      "Equipo": "Equipo",
      "Mantenimiento": "Mantenimiento",
      "Laboratorio": "Laboratorio",
      "Reportar Falla": "Reportar Falla",
      "Confirmar": "Confirmar",
      "Cargando...": "Cargando...",
      "Credenciales incorrectas": "Credenciales incorrectas",

      // Footer
      "Sistema de Gestión de Inventario Tecnológico": "Sistema de Gestión de Inventario Tecnológico"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // Siempre usar español
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

