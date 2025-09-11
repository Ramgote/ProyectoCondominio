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
      // El servidor respondió con un estado fuera del rango 2xx
      console.error('Error de respuesta:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('Error de conexión:', error.request);
      return Promise.reject({ message: 'No se pudo conectar al servidor. Por favor, verifica tu conexión.' });
    } else {
      // Algo pasó en la configuración de la solicitud que generó un error
      console.error('Error:', error.message);
      return Promise.reject({ message: 'Error en la configuración de la solicitud.' });
    }
  }
);

// Funciones para Residentes
export const getResidentes = async () => {
  try {
    const response = await api.get('/residentes/residentes/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener residentes:', error);
    throw error;
  }
};

export const getResidente = async (id) => {
  try {
    const response = await api.get(`/residentes/residentes/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el residente con ID ${id}:`, error);
    throw error;
  }
};

export const createResidente = async (residenteData) => {
  try {
    // Asegurarse de que ci sea una cadena, no un array
    const dataToSend = {
      ...residenteData,
      ci: Array.isArray(residenteData.ci) ? residenteData.ci[0] : residenteData.ci
    };
    
    console.log('Creando nuevo residente con datos:', dataToSend);
    const response = await api.post('/residentes/residentes/', dataToSend);
    return response.data;
  } catch (error) {
    console.error('Error al crear residente:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const updateResidente = async (id, residenteData) => {
  try {
    // Asegurarse de que ci sea una cadena, no un array
    const dataToSend = {
      ...residenteData,
      ci: Array.isArray(residenteData.ci) ? residenteData.ci[0] : residenteData.ci
    };
    
    console.log('Enviando datos al servidor:', dataToSend);
    const response = await api.put(`/residentes/residentes/${id}/`, dataToSend);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el residente con ID ${id}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const deleteResidente = async (id) => {
  try {
    const response = await api.delete(`/residentes/residentes/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el residente con ID ${id}:`, error);
    throw error;
  }
};

// Funciones para Tipos de Vehículo
export const getTiposVehiculo = async () => {
  try {
    console.log('Solicitando tipos de vehículo...');
    const response = await api.get('/residentes/tipos-vehiculo/');
    console.log('Respuesta de tipos de vehículo:', response.data);
    // Si la respuesta es un array, devolverlo directamente
    // Si es un objeto con results, devolver results
    const data = Array.isArray(response.data) ? response.data : 
                (response.data?.results || response.data || []);
    console.log('Datos de tipos procesados:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener tipos de vehículo:', error);
    console.error('Detalles del error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const createTipoVehiculo = async (tipoData) => {
  try {
    const response = await api.post('/residentes/tipos-vehiculo/', tipoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear tipo de vehículo:', error);
    throw error;
  }
};

// Funciones para Marcas de Vehículo
export const getMarcasVehiculo = async () => {
  try {
    console.log('Solicitando marcas de vehículo...');
    const response = await api.get('/residentes/marcas-vehiculo/');
    console.log('Respuesta de marcas de vehículo:', response.data);
    // Si la respuesta es un array, devolverlo directamente
    // Si es un objeto con results, devolver results
    const data = Array.isArray(response.data) ? response.data : 
                (response.data?.results || response.data || []);
    console.log('Datos de marcas procesados:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener marcas de vehículo:', error);
    console.error('Detalles del error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const createMarcaVehiculo = async (marcaData) => {
  try {
    const response = await api.post('/residentes/marcas-vehiculo/', marcaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear marca de vehículo:', error);
    throw error;
  }
};

// Funciones para Vehículos
export const getVehiculos = async () => {
  try {
    const response = await api.get('/residentes/vehiculos/');
    console.log('Respuesta de todos los vehículos:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    console.error('Detalles del error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const getVehiculosPorResidente = async (residenteId) => {
  try {
    // Usar el parámetro de consulta para filtrar vehículos por residente
    const response = await api.get(`/residentes/vehiculos/`, {
      params: {
        idResidente: residenteId
      }
    });
    console.log('Vehículos del residente:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener vehículos del residente ${residenteId}:`, error);
    console.error('Detalles del error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const getVehiculo = async (id) => {
  try {
    const response = await api.get(`/residentes/vehiculos/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el vehículo con ID ${id}:`, error);
    throw error;
  }
};

export const createVehiculo = async (vehiculoData) => {
  try {
    const response = await api.post('/residentes/vehiculos/', vehiculoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear vehículo:', error);
    throw error;
  }
};

export const updateVehiculo = async (id, vehiculoData) => {
  try {
    const response = await api.put(`/residentes/vehiculos/${id}/`, vehiculoData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el vehículo con ID ${id}:`, error);
    throw error;
  }
};

export const deleteVehiculo = async (id) => {
  try {
    const response = await api.delete(`/residentes/vehiculos/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el vehículo con ID ${id}:`, error);
    throw error;
  }
};