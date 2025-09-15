import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Configuración global de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Error de respuesta:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error('Error de conexión:', error.request);
      return Promise.reject({ message: 'No se pudo conectar al servidor. Verifica tu conexión.' });
    } else {
      console.error('Error:', error.message);
      return Promise.reject({ message: 'Error en la configuración de la solicitud.' });
    }
  }
);

//
// 🔹 Funciones para Usuarios
//
export const getUsuarios = async () => {
  try {
    const response = await api.get('/usuarios/');
    const data = response.data;

    // Asegurar que siempre devuelva un array
    if (Array.isArray(data)) {
      return data;
    } else if (data?.results && Array.isArray(data.results)) {
      return data.results;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return []; // devolvemos array vacío para evitar errores en .map
  }
};

export const getUsuario = async (id) => {
  try {
    const response = await api.get(`/usuarios/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el usuario con ID ${id}:`, error);
    throw error;
  }
};

export const createUsuario = async (usuarioData) => {
  try {
    const response = await api.post('/usuarios/', usuarioData);
    return response.data;
  } catch (error) {
    console.error('Error al crear usuario:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const updateUsuario = async (id, usuarioData) => {
  try {
    const response = await api.put(`/usuarios/${id}/`, usuarioData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el usuario con ID ${id}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const deleteUsuario = async (id) => {
  try {
    const response = await api.delete(`/usuarios/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el usuario con ID ${id}:`, error);
    throw error;
  }
};
