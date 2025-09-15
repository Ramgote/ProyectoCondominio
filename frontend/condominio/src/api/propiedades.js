import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Configuración global de axios con la URL base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    // Aquí es donde agregaremos el token dinámicamente
  },
});

// Interceptor para manejar errores globalmente, idéntico al que ya usas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Error de respuesta:', error.response.data);
      // Opcional: Si recibes un 401 Unauthorized, puedes redirigir al login
      if (error.response.status === 401) {
        console.warn('Petición no autorizada (401). Posiblemente el token ha expirado o no es válido.');
        // Puedes agregar lógica para limpiar el token y redirigir al login
        // clearAuthToken();
        // window.location.href = '/login'; // O tu ruta de login
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error('Error de conexión:', error.request);
      return Promise.reject({ message: 'No se pudo conectar al servidor. Por favor, verifica tu conexión.' });
    } else {
      console.error('Error:', error.message);
      return Promise.reject({ message: 'Error en la configuración de la solicitud.' });
    }
  }
);

// --- NUEVA FUNCIONALIDAD: Gestión del Token de Autenticación ---

/**
 * Guarda el token de autenticación y lo configura para todas las peticiones futuras de axios.
 * @param {string} token El token de autenticación (ej. JWT o Token de DRF).
 */
export const setAuthToken = (token) => {
  if (token) {
    // Almacena el token en localStorage para que persista entre sesiones
    localStorage.setItem('authToken', token);
    // Configura el encabezado Authorization para todas las peticiones futuras
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
    // Si usas JWT, sería 'Bearer ${token}'
  } else {
    // Si no se proporciona token, elimina el token de localStorage y de los encabezados
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Carga el token de autenticación desde localStorage al iniciar la aplicación
 * y lo configura en las cabeceras de Axios.
 */
export const loadAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    setAuthToken(token);
    console.log('Token de autenticación cargado y configurado.');
  } else {
    console.log('No se encontró token de autenticación en localStorage.');
  }
};

// Cargar el token al iniciar el módulo (solo una vez)
// Esto asegura que si el usuario ya ha iniciado sesión en una sesión anterior,
// el token se cargue y se use automáticamente.
loadAuthToken();


// --- Funciones para la gestión de Propiedades (estas no necesitan cambios directos) ---

/**
 * Obtiene todas las propiedades del sistema.
 * @returns {Promise<Array>} Un array con los datos de todas las propiedades.
 */
export const getPropiedades = async () => {
  try {
    const response = await api.get('/propiedades/propiedades/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    throw error;
  }
};

/**
 * Obtiene una propiedad específica por su ID.
 * @param {number|string} id El ID de la propiedad.
 * @returns {Promise<Object>} Los datos de la propiedad.
 */
export const getPropiedad = async (id) => {
  try {
    const response = await api.get(`/propiedades/propiedades/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la propiedad con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Crea una nueva propiedad.
 * @param {Object} propiedadData Los datos de la nueva propiedad.
 * @returns {Promise<Object>} Los datos de la propiedad creada.
 */
export const createPropiedad = async (propiedadData) => {
  try {
    const response = await api.post('/propiedades/propiedades/', propiedadData);
    return response.data;
  } catch (error) {
    console.error('Error al crear propiedad:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Actualiza una propiedad existente.
 * @param {number|string} id El ID de la propiedad a actualizar.
 * @param {Object} propiedadData Los datos actualizados de la propiedad.
 * @returns {Promise<Object>} Los datos de la propiedad actualizada.
 */
export const updatePropiedad = async (id, propiedadData) => {
  try {
    const response = await api.put(`/propiedades/propiedades/${id}/`, propiedadData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la propiedad con ID ${id}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Elimina una propiedad por su ID.
 * @param {number|string} id El ID de la propiedad a eliminar.
 * @returns {Promise<Object>} La respuesta del servidor tras la eliminación.
 */
export const deletePropiedad = async (id) => {
  try {
    const response = await api.delete(`/propiedades/propiedades/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar la propiedad con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene las propiedades asociadas a un residente específico.
 * @param {number|string} residenteId El ID del residente.
 * @returns {Promise<Array>} Un array con las propiedades del residente.
 */
export const getPropiedadesPorResidente = async (residenteId) => {
  try {
    const response = await api.get(`/propiedades/propiedades/`, {
      params: {
        idResidente: residenteId
      }
    });
    console.log(`Propiedades del residente ${residenteId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener propiedades del residente ${residenteId}:`, error);
    throw error;
  }
};

// --- Funciones para la gestión de Residentes ---

/**
 * Crea un nuevo residente y lo asocia a una propiedad.
 * @param {Object} residenteData Los datos del nuevo residente, incluyendo id_propiedad.
 * @returns {Promise<Object>} Los datos del residente creado.
 */
export const createResidente = async (residenteData) => {
    try {
        const response = await api.post('/residentes/residentes/', residenteData);
        return response.data;
    } catch (error) {
        console.error('Error al crear residente:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};