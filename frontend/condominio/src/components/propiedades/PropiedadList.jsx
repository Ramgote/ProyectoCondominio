import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PencilSquareIcon, TrashIcon, PlusIcon, UserPlusIcon } from '@heroicons/react/24/outline'; // Import UserPlusIcon
import {
    getPropiedades,
    createPropiedad,
    deletePropiedad,
    updatePropiedad
} from "../../api/propiedades";
import { createResidente } from "../../api/residentes"; // Import the API function for creating a resident

export default function PropiedadList() {
    const [propiedades, setPropiedades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isResidenteModalOpen, setIsResidenteModalOpen] = useState(false); // New state for resident modal
    const [propiedadToDelete, setPropiedadToDelete] = useState(null);
    const [editingPropiedad, setEditingPropiedad] = useState(null);
    const [propiedadIdForResidente, setPropiedadIdForResidente] = useState(null); // To know which property to add a resident to
    const [formData, setFormData] = useState({
        numero_unidad: '',
        direccion: '',
        descripcion: '',
        tipo_propiedad: 'V',
        habitada: false,
        id_residente: '',
    });
    const [residenteFormData, setResidenteFormData] = useState({ // New state for resident form
        ci: '',
        nombre: '',
        apPaterno: '',
        apMaterno: '',
        email: '',
        tipo: 'Propietario',
        responsable: false
    });
    const [message, setMessage] = useState(null);

    const navigate = useNavigate();

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => {
            setMessage(null);
        }, 3000);
    };

    const loadPropiedades = async () => {
        try {
            setLoading(true);
            const response = await getPropiedades();
            const propiedadesData = response && response.results ? response.results : [];
            setPropiedades(propiedadesData);
        } catch (error) {
            console.error('Error al cargar propiedades:', error);
            showMessage('Error al cargar las propiedades. Por favor, intente de nuevo.', 'error');
            setPropiedades([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPropiedades();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleResidenteInputChange = (e) => { // New handler for resident form
        const { name, value, type, checked } = e.target;
        setResidenteFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = { ...formData };
            delete dataToSend.habitantes;

            if (editingPropiedad) {
                await updatePropiedad(editingPropiedad.id, dataToSend);
                showMessage('Propiedad actualizada correctamente', 'success');
            } else {
                await createPropiedad(dataToSend);
                showMessage('Propiedad creada correctamente', 'success');
            }
            setFormData({
                numero_unidad: '',
                direccion: '',
                descripcion: '',
                tipo_propiedad: 'V',
                habitada: false,
                id_residente: '',
            });
            setEditingPropiedad(null);
            setIsModalOpen(false);
            loadPropiedades();
        } catch (error) {
            console.error('Error al guardar propiedad:', error);
            showMessage(`Error al ${editingPropiedad ? 'actualizar' : 'crear'} la propiedad: ${error.detail || error.message}`, 'error');
        }
    };

    const handleResidenteSubmit = async (e) => { // New function to handle resident form submission
        e.preventDefault();
        try {
            const dataToSend = {
                ...residenteFormData,
                id_propiedad: propiedadIdForResidente // Attach the property ID
            };
            await createResidente(dataToSend);
            showMessage('Residente añadido correctamente', 'success');
            setIsResidenteModalOpen(false);
            setResidenteFormData({
                ci: '',
                nombre: '',
                apPaterno: '',
                apMaterno: '',
                email: '',
                tipo: 'Propietario',
                responsable: false
            });
            loadPropiedades(); // Reload properties to reflect the new resident count
        } catch (error) {
            console.error('Error al añadir residente:', error);
            showMessage(`Error al añadir el residente: ${error.detail || error.message}`, 'error');
        }
    };

    const handleEdit = (propiedad) => {
        setEditingPropiedad(propiedad);
        setFormData({
            numero_unidad: propiedad.numero_unidad || '',
            direccion: propiedad.direccion || '',
            descripcion: propiedad.descripcion || '',
            tipo_propiedad: propiedad.tipo_propiedad || 'V',
            habitada: propiedad.habitada,
            id_residente: propiedad.id_residente || '',
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        setPropiedadToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await deletePropiedad(propiedadToDelete);
            showMessage('Propiedad eliminada correctamente', 'success');
            loadPropiedades();
        } catch (error) {
            console.error('Error al eliminar propiedad:', error);
            showMessage('Error al eliminar la propiedad', 'error');
        } finally {
            setIsConfirmModalOpen(false);
            setPropiedadToDelete(null);
        }
    };

    const handleAddResidenteClick = (propiedadId) => { // Updated function to add a resident
        setPropiedadIdForResidente(propiedadId);
        setIsResidenteModalOpen(true);
    };

    const openNewPropiedadModal = () => {
        setEditingPropiedad(null);
        setFormData({
            numero_unidad: '',
            direccion: '',
            descripcion: '',
            tipo_propiedad: 'V',
            habitada: false,
            id_residente: '',
        });
        setIsModalOpen(true);
    };

    const tipoMap = {
        'V': 'Vivienda',
        'C': 'Comercial'
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
                <div className={`fixed top-4 right-4 z-[10000] p-4 rounded-md text-white shadow-lg ${message.type === 'success' ? 'bg-green-500' : message.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
                    {message.text}
                </div>
            )}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-sky-800">Propiedades</h1>
                <button
                    onClick={openNewPropiedadModal}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-md flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span className="hidden sm:inline">Nueva Propiedad</span>
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Unidad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Habitada</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° de Residentes</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {propiedades.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No hay propiedades registradas
                                    </td>
                                </tr>
                            ) : (
                                propiedades.map((propiedad) => (
                                    <tr key={propiedad.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{propiedad.numero_unidad}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{propiedad.direccion}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{tipoMap[propiedad.tipo_propiedad]}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{propiedad.habitada ? 'Sí' : 'No'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{propiedad.numero_residentes}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(propiedad)}
                                                    className="text-sky-600 hover:text-sky-900"
                                                    title="Editar"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(propiedad.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleAddResidenteClick(propiedad.id)}
                                                    className="text-green-500 hover:text-green-700"
                                                    title="Añadir residente"
                                                >
                                                    <UserPlusIcon className="h-5 w-5" /> {/* Use the new icon */}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para agregar/editar propiedad */}
            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-[9999] p-4">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-medium text-gray-900">
                                {editingPropiedad ? 'Editar Propiedad' : 'Nueva Propiedad'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <label htmlFor="numero_unidad" className="block text-sm font-medium text-gray-700 mb-1">
                                    Número de Unidad
                                </label>
                                <input
                                    type="text"
                                    id="numero_unidad"
                                    name="numero_unidad"
                                    value={formData.numero_unidad}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    placeholder="ej. A-101, Torre B-205"
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Número o identificador único de la propiedad.
                                </p>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    id="direccion"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    placeholder="ej. Calle Yotaú # 12"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Indique una dirección.
                                </p>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    placeholder="Una descripción detallada de la propiedad."
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="tipo_propiedad" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Propiedad
                                </label>
                                <select
                                    id="tipo_propiedad"
                                    name="tipo_propiedad"
                                    value={formData.tipo_propiedad}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                >
                                    <option value="V">Vivienda</option>
                                    <option value="C">Comercial</option>
                                </select>
                            </div>
                            <div className="mb-6 flex items-center">
                                <input
                                    type="checkbox"
                                    id="habitada"
                                    name="habitada"
                                    checked={formData.habitada}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                />
                                <label htmlFor="habitada" className="ml-2 block text-sm font-medium text-gray-700">
                                    Habitada
                                </label>
                            </div>
                            <div className="flex justify-end space-x-3">
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
                                    {editingPropiedad ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isResidenteModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] p-4">
                    <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-medium text-gray-900">Añadir Residente</h3>
                        </div>
                        <form onSubmit={handleResidenteSubmit} className="p-6">
                            <div className="mb-4 sm:mb-0 w-full sm:w-1/2">
                                <label htmlFor="ci" className="block text-sm font-medium text-gray-700">Ci:</label>
                                <input
                                    type="text"
                                    id="ci"
                                    name="ci"
                                    value={residenteFormData.ci}
                                    onChange={handleResidenteInputChange}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={residenteFormData.nombre}
                                    onChange={handleResidenteInputChange}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                                    required
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
                                <div className="mb-4 sm:mb-0 w-full sm:w-1/2">
                                    <label htmlFor="apPaterno" className="block text-sm font-medium text-gray-700">ApPaterno:</label>
                                    <input
                                        type="text"
                                        id="apPaterno"
                                        name="apPaterno"
                                        value={residenteFormData.apPaterno}
                                        onChange={handleResidenteInputChange}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                                    />
                                </div>
                                <div className="w-full sm:w-1/2">
                                    <label htmlFor="apMaterno" className="block text-sm font-medium text-gray-700">ApMaterno:</label>
                                    <input
                                        type="text"
                                        id="apMaterno"
                                        name="apMaterno"
                                        value={residenteFormData.apMaterno}
                                        onChange={handleResidenteInputChange}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={residenteFormData.email}
                                    onChange={handleResidenteInputChange}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
                                <div className="mb-4 sm:mb-0 w-full sm:w-1/2">
                                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo:</label>
                                    <select
                                        id="tipo"
                                        name="tipo"
                                        value={residenteFormData.tipo}
                                        onChange={handleResidenteInputChange}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                                    >
                                        <option value="Propietario">Propietario</option>
                                        <option value="Inquilino">Inquilino</option>
                                    </select>
                                </div>
                                <div className="w-full sm:w-1/2 flex items-center pt-5">
                                    <input
                                        type="checkbox"
                                        id="responsable"
                                        name="responsable"
                                        checked={residenteFormData.responsable}
                                        onChange={handleResidenteInputChange}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="responsable" className="ml-2 block text-sm font-medium text-gray-700">Responsable</label>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsResidenteModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de confirmación para eliminar */}
            {isConfirmModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-[10000] p-4">
                    <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmar eliminación</h3>
                        <p className="mb-6">¿Estás seguro de que deseas eliminar esta propiedad?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setIsConfirmModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}