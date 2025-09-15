import { useEffect, useState } from "react";
import { getBitacoras, getUsuarios } from "../../api/bitacora"; // Importar la API de bitácoras
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function BitacoraList() {
    const [bitacoras, setBitacoras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        fecha_inicio: '',
        fecha_fin: '',
        usuario: '',
        accion_realizada: ''
    });
    const [usuarios, setUsuarios] = useState([]);
    const [message, setMessage] = useState(null);

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => {
            setMessage(null);
        }, 3000);
    };

    const loadBitacoras = async (currentFilters) => {
        try {
            setLoading(true);
            const data = await getBitacoras(currentFilters);
            setBitacoras(data);
        } catch (error) {
            console.error('Error al cargar bitácoras:', error);
            showMessage('Error al cargar la bitácora. Intente de nuevo.', 'error');
            setBitacoras([]);
        } finally {
            setLoading(false);
        }
    };

    const loadUsuarios = async () => {
        try {
            const data = await getUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        }
    };

    useEffect(() => {
        loadBitacoras(filters);
        loadUsuarios();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadBitacoras(filters);
    };

    const handleClearFilters = () => {
        setFilters({
            fecha_inicio: '',
            fecha_fin: '',
            usuario: '',
            accion_realizada: ''
        });
        loadBitacoras({});
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
            {message && (
                <div className={`fixed top-4 right-4 z-[10000] p-4 rounded-md text-white shadow-lg ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {message.text}
                </div>
            )}
            <h1 className="text-3xl font-bold text-sky-800 mb-6">Bitácora de Eventos</h1>
            
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Filtrar Bitácora</h2>
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                        <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700">Fecha de Inicio:</label>
                        <input
                            type="date"
                            id="fecha_inicio"
                            name="fecha_inicio"
                            value={filters.fecha_inicio}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="fecha_fin" className="block text-sm font-medium text-gray-700">Fecha de Fin:</label>
                        <input
                            type="date"
                            id="fecha_fin"
                            name="fecha_fin"
                            value={filters.fecha_fin}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">Usuario:</label>
                        <select
                            id="usuario"
                            name="usuario"
                            value={filters.usuario}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Todos</option>
                            {usuarios.map(user => (
                                <option key={user.id} value={user.username}>{user.username}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="accion_realizada" className="block text-sm font-medium text-gray-700">Acción:</label>
                        <input
                            type="text"
                            id="accion_realizada"
                            name="accion_realizada"
                            value={filters.accion_realizada}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Ej. 'Crear propiedad'"
                        />
                    </div>
                    <div className="flex space-x-2 mt-4 md:mt-0">
                        <button
                            type="submit"
                            className="w-full md:w-auto px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md flex items-center justify-center gap-2"
                        >
                            <MagnifyingGlassIcon className="h-5 w-5" />
                            Buscar
                        </button>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                        >
                            <ArrowPathIcon className="h-5 w-5" />
                            Limpiar
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción Realizada</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha y Hora</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID de Acción</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP de Origen</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {console.log(bitacoras)}
                            {bitacoras.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        No se encontraron registros de bitácora
                                    </td>
                                </tr>
                            ) : (
                                bitacoras.map((log) => (                                    
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.usuario}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.accion_realizada}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(log.hora_fecha).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.id_accion}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.ip_origen}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}