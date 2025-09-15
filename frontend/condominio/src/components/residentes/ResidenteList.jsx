import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    getResidentes,
    deleteResidente,
    createResidente,
    updateResidente
} from "../../api/residentes"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { FaCar, FaDog } from "react-icons/fa"

export default function ResidenteList() {
    // Aseguramos que residentes siempre sea un array
    const [residentes, setResidentes] = useState(() => [])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingResidente, setEditingResidente] = useState(null)
    const [formData, setFormData] = useState({
        ci: '',
        nombre: '',
        apPaterno: '',
        apMaterno: ''
    })

    const navigate = useNavigate()

    const loadResidentes = async () => {
        try {
            setLoading(true);
            const response = await getResidentes();
            console.log('Datos recibidos de la API:', response);

            // Extraemos el array de resultados de la respuesta paginada
            const residentesData = response && response.results ? response.results : [];
            console.log('Datos de residentes a mostrar:', residentesData);

            setResidentes(residentesData);
        } catch (error) {
            console.error('Error cargando residentes:', error);
            console.error('Detalles del error:', {
                message: error.message,
                response: error.response,
                request: error.request
            });
            toast.error('Error al cargar los residentes. Por favor, intente de nuevo.');
            setResidentes([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadResidentes()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            console.log('Enviando datos del formulario:', formData);
            if (editingResidente) {
                console.log('Actualizando residente con ID:', editingResidente.id);
                const response = await updateResidente(editingResidente.id, formData);
                console.log('Respuesta de actualización:', response);
                toast.success('Residente actualizado correctamente')
            } else {
                console.log('Creando nuevo residente');
                const response = await createResidente(formData);
                console.log('Respuesta de creación:', response);
                toast.success('Residente creado correctamente')
            }
            setFormData({ ci: '', nombre: '', apPaterno: '', apMaterno: '' })
            setEditingResidente(null)
            setIsModalOpen(false)
            loadResidentes()
        } catch (error) {
            console.error('Error guardando residente:', error);
            console.error('Detalles del error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error(`Error al ${editingResidente ? 'actualizar' : 'crear'} el residente: ${error.response?.data?.detail || error.message}`)
        }
    }

    const handleEdit = (residente) => {
        setEditingResidente(residente)
        setFormData({
            ci: residente.ci || '',
            nombre: residente.nombre || '',
            apPaterno: residente.apPaterno || '',
            apMaterno: residente.apMaterno || ''
        })
        setIsModalOpen(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este residente?')) {
            try {
                await deleteResidente(id)
                toast.success('Residente eliminado correctamente')
                loadResidentes()
            } catch (error) {
                console.error('Error eliminando residente:', error)
                toast.error('Error al eliminar el residente')
            }
        }
    }

    const handleViewVehiculos = (id) => {
        navigate(`/residentes/${id}/vehiculos`)
    }

    const openNewResidenteModal = () => {
        setEditingResidente(null)
        setFormData({ ci: '', nombre: '', apPaterno: '', apMaterno: '' })
        setIsModalOpen(true)
    }

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
        </div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-sky-800">Residentes</h1>
                <button
                    onClick={openNewResidenteModal}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-md flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    {/* Solo mostrar el texto en pantallas medianas en adelante */}
                    <span className="hidden sm:inline">Nuevo Residente</span>
                </button>

            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CI</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {console.log('Residentes en el render:', residentes)}
                            {residentes.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                        No hay residentes registrados.
                                    </td>
                                </tr>
                            ) : (
                                residentes.map((residente) => (
                                    <tr key={residente.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{residente.ci}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {`${residente.nombre} ${residente.apPaterno} ${residente.apMaterno || ''}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(residente)}
                                                    className="text-sky-600 hover:text-sky-900"
                                                    title="Editar"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(residente.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleViewVehiculos(residente.id)}
                                                    className="text-green-500 hover:text-green-700"
                                                    title="Ver vehículos"
                                                >
                                                    < FaCar className="h-5 w-5"/>
                                                </button>
                                                <button
                                                    className="text-blue-500 hover:text-blue-700"
                                                    title="Ver Mascotas"
                                                >
                                                    < FaDog className="h-5 w-5"/>
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

            {/* Modal para agregar/editar residente */}
            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-[9999] p-4">
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30" onClick={() => setIsModalOpen(false)}></div>
                    {/* Modal */}
                    <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-medium text-gray-900">
                                {editingResidente ? 'Editar Residente' : 'Nuevo Residente'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <label htmlFor="ci" className="block text-sm font-medium text-gray-700 mb-1">
                                    CI
                                </label>
                                <input
                                    type="text"
                                    id="ci"
                                    name="ci"
                                    value={formData.ci}
                                    onChange={handleInputChange}
                                    readOnly={!!editingResidente}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 ${editingResidente ? 'bg-gray-100' : ''}`}
                                    required
                                />
                                {editingResidente && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        No se puede modificar el CI de un residente existente.
                                    </p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="apPaterno" className="block text-sm font-medium text-gray-700 mb-1">
                                    Apellido Paterno
                                </label>
                                <input
                                    type="text"
                                    id="apPaterno"
                                    name="apPaterno"
                                    value={formData.apPaterno}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="apMaterno" className="block text-sm font-medium text-gray-700 mb-1">
                                    Apellido Materno (opcional)
                                </label>
                                <input
                                    type="text"
                                    id="apMaterno"
                                    name="apMaterno"
                                    value={formData.apMaterno}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                />
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
                                    {editingResidente ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}