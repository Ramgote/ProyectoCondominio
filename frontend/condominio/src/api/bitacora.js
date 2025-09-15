import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('Error de respuesta:', error.response.data);
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

/**
 * Obtiene los registros de la bitácora con opciones de filtro.
 * @param {Object} filters - Objeto con los filtros a aplicar.
 * @param {string} [filters.fecha_inicio] - Fecha de inicio para el rango de búsqueda (formato YYYY-MM-DD).
 * @param {string} [filters.fecha_fin] - Fecha de fin para el rango de búsqueda (formato YYYY-MM-DD).
 * @param {string} [filters.usuario] - Nombre de usuario para filtrar.
 * @param {string} [filters.accion_realizada] - Texto para buscar en la acción realizada.
 * @returns {Promise<Array>} Un array con los datos de los registros de la bitácora.
 */
export const getBitacoras = async (filters = {}) => {
    try {
        const response = await api.get('/bitacora/bitacora/', {
            params: {
                fecha_inicio: filters.fecha_inicio,
                fecha_fin: filters.fecha_fin,
                usuario: filters.usuario,
                accion_realizada: filters.accion_realizada,
            }
        });
        return response.data.results || [];
    } catch (error) {
        console.error('Error al obtener bitácoras:', error);
        throw error;
    }
};

/**
 * Obtiene la lista de usuarios.
 * Esto es útil para el dropdown de filtro.
 * @returns {Promise<Array>} Un array con los datos de los usuarios.
 */
export const getUsuarios = async () => {
    try {
        const response = await api.get('/usuarios/'); // Asumiendo un endpoint para usuarios
        return response.data.results || [];
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
};