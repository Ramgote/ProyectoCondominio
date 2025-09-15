import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    getVehiculosPorResidente, 
    deleteVehiculo,
    getTiposVehiculo,
    getMarcasVehiculo,
    createTipoVehiculo,
    createMarcaVehiculo,
    createVehiculo,
    updateVehiculo
} from '../../api/residentes';
import { PencilSquareIcon, TrashIcon, PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VehiculosList() {
    const { residenteId } = useParams();
    const navigate = useNavigate();
    
    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tiposVehiculo, setTiposVehiculo] = useState([]);
    const [marcasVehiculo, setMarcasVehiculo] = useState([]);
    const [nuevoTipo, setNuevoTipo] = useState('');
    const [nuevaMarca, setNuevaMarca] = useState('');
    const [showNuevoTipo, setShowNuevoTipo] = useState(false);
    const [showNuevaMarca, setShowNuevaMarca] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        placa: '',
        color: '',
        tipo: '',
        marca: '',
        idResidente: residenteId,
        id: null
    });

    const loadVehiculos = async () => {
        try {
            setLoading(true);
            const response = await getVehiculosPorResidente(residenteId);
            console.log('Respuesta de vehículos:', response);
            
            // Extraer el array de resultados de la respuesta paginada
            const vehiculosData = response && response.results ? response.results : [];
            console.log('Datos de vehículos a mostrar:', vehiculosData);
            
            setVehiculos(vehiculosData);
        } catch (error) {
            console.error('Error cargando vehículos:', error);
            console.error('Detalles del error:', {
                message: error.message,
                response: error.response,
                request: error.request
            });
            toast.error('Error al cargar los vehículos');
            setVehiculos([]);
        } finally {
            setLoading(false);
        }
    };

    const loadCatalogos = async () => {
        try {
            console.log('Cargando catálogos...');
            const [tiposResponse, marcasResponse] = await Promise.all([
                getTiposVehiculo(),
                getMarcasVehiculo()
            ]);
            
            // Verificar la estructura de la respuesta y extraer los datos
            const tipos = Array.isArray(tiposResponse) ? tiposResponse : 
                        (tiposResponse?.results || []);
            
            const marcas = Array.isArray(marcasResponse) ? marcasResponse : 
                         (marcasResponse?.results || []);
            
            console.log('Tipos de vehículo cargados:', tipos);
            console.log('Marcas de vehículo cargadas:', marcas);
            
            setTiposVehiculo(tipos);
            setMarcasVehiculo(marcas);
        } catch (error) {
            console.error('Error cargando catálogos:', error);
            console.error('Detalles del error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error('Error al cargar los catálogos');
            setTiposVehiculo([]);
            setMarcasVehiculo([]);
        }
    };

    useEffect(() => {
        loadVehiculos();
        loadCatalogos();
    }, [residenteId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Evitar múltiples envíos mientras se procesa
        if (loading) return;
        
        try {
            setLoading(true);
            const vehiculoData = {
                placa: formData.placa,
                color: formData.color,
                marca: formData.marca,
                idTipo: formData.tipo,
                idResidente: residenteId
            };

            if (formData.id) {
                // Actualizar vehículo existente
                await updateVehiculo(formData.id, vehiculoData);
                toast.success('Vehículo actualizado correctamente');
            } else {
                // Crear nuevo vehículo
                await createVehiculo(vehiculoData);
                toast.success('Vehículo guardado correctamente');
            }
            
            // Reset form and close modal
            setFormData({
                placa: '',
                color: '',
                tipo: '',
                marca: '',
                idResidente: residenteId,
                id: null
            });
            
            setIsModalOpen(false);
            setIsEditing(false);
            await loadVehiculos();
        } catch (error) {
            console.error('Error guardando vehículo:', error);
            // Verificar si el error ya fue manejado o no
            if (!error.handled) {
                const errorMessage = error.response?.data?.message || error.message || 'Error al guardar el vehículo';
                toast.error(errorMessage, { toastId: 'vehiculo-error' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
            try {
                await deleteVehiculo(id);
                toast.success('Vehículo eliminado correctamente');
                loadVehiculos();
            } catch (error) {
                console.error('Error eliminando vehículo:', error);
                toast.error('Error al eliminar el vehículo');
            }
        }
    };

    const handleAddTipo = async () => {
        if (!nuevoTipo.trim()) return;
        try {
            await createTipoVehiculo({ tipo: nuevoTipo });
            const tipos = await getTiposVehiculo();
            setTiposVehiculo(tipos);
            setNuevoTipo('');
            setShowNuevoTipo(false);
            toast.success('Tipo de vehículo agregado correctamente');
        } catch (error) {
            console.error('Error agregando tipo de vehículo:', error);
            toast.error('Error al agregar el tipo de vehículo');
        }
    };

    const handleAddMarca = async () => {
        if (!nuevaMarca.trim()) return;
        try {
            await createMarcaVehiculo({ marca: nuevaMarca });
            const marcas = await getMarcasVehiculo();
            setMarcasVehiculo(marcas);
            setNuevaMarca('');
            setShowNuevaMarca(false);
            toast.success('Marca de vehículo agregada correctamente');
        } catch (error) {
            console.error('Error agregando marca de vehículo:', error);
            toast.error('Error al agregar la marca de vehículo');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-4 text-sky-600 hover:text-sky-800"
                    title="Volver"
                >
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Vehículos del Residente</h1>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800">Lista de Vehículos</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Agregar Vehículo</span>                        
                    </button>
                </div>
                
                {vehiculos.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No hay vehículos registrados para este residente.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {vehiculos.map((vehiculo) => (
                                    <tr key={vehiculo.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {vehiculo.placa}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {vehiculo.color}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {vehiculo.marca_nombre || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {vehiculo.tipo_nombre || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    className="text-sky-600 hover:text-sky-900"
                                                    title="Editar"
                                                    onClick={() => {
                                                        setFormData({
                                                            placa: vehiculo.placa,
                                                            color: vehiculo.color,
                                                            tipo: vehiculo.idTipo || '',
                                                            marca: vehiculo.idMarca || '',
                                                            id: vehiculo.id
                                                        });
                                                        setIsEditing(true);
                                                        setIsModalOpen(true);
                                                    }}
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Eliminar"
                                                    onClick={() => handleDelete(vehiculo.id)}
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal para agregar/editar vehículo */}
            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-[9999] p-4">
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30" onClick={() => {
                        setIsModalOpen(false);
                        setIsEditing(false);
                    }}></div>
                    {/* Modal */}
                    <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-medium text-gray-900">
                                {formData.id ? 'Editar Vehículo' : 'Agregar Vehículo'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="placa" className="block text-sm font-medium text-gray-700 mb-1">
                                        Placa
                                    </label>
                                    <input
                                        type="text"
                                        id="placa"
                                        name="placa"
                                        value={formData.placa}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                                        Color
                                    </label>
                                    <input
                                        type="text"
                                        id="color"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                                            Tipo de Vehículo
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowNuevoTipo(!showNuevoTipo)}
                                            className="text-xs text-sky-600 hover:text-sky-800"
                                        >
                                            {showNuevoTipo ? 'Cancelar' : '+ Nuevo Tipo'}
                                        </button>
                                    </div>
                                    
                                    {showNuevoTipo ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={nuevoTipo}
                                                onChange={(e) => setNuevoTipo(e.target.value)}
                                                placeholder="Ej: Automóvil, Moto, etc."
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddTipo}
                                                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                            >
                                                Agregar
                                            </button>
                                        </div>
                                    ) : (
                                        <select
                                            id="tipo"
                                            name="tipo"
                                            value={formData.tipo}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                            required
                                        >
                                            <option value="">Seleccione un tipo</option>
                                            {tiposVehiculo.map((tipo) => (
                                                <option key={tipo.id} value={tipo.id}>
                                                    {tipo.tipo}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
                                            Marca
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowNuevaMarca(!showNuevaMarca)}
                                            className="text-xs text-sky-600 hover:text-sky-800"
                                        >
                                            {showNuevaMarca ? 'Cancelar' : '+ Nueva Marca'}
                                        </button>
                                    </div>
                                    
                                    {showNuevaMarca ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={nuevaMarca}
                                                onChange={(e) => setNuevaMarca(e.target.value)}
                                                placeholder="Ej: Toyota, Honda, etc."
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddMarca}
                                                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                            >
                                                Agregar
                                            </button>
                                        </div>
                                    ) : (
                                        <select
                                            id="marca"
                                            name="marca"
                                            value={formData.marca}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                            required
                                        >
                                            <option value="">Seleccione una marca</option>
                                            {marcasVehiculo.map((marca) => (
                                                <option key={marca.id} value={marca.id}>
                                                    {marca.marca}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                >
                                    Guardar Vehículo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
