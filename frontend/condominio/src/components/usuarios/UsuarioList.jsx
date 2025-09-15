import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from "../../api/usuarios"
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function UsuariosList() {
  const navigate = useNavigate()

  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phones: [""]
  })

  // 🔹 Cargar usuarios
  const loadUsuarios = async () => {
    try {
      setLoading(true)
      const data = await getUsuarios()
      setUsuarios(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error cargando usuarios:", error)
      toast.error("Error al cargar usuarios")
      setUsuarios([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsuarios()
  }, [])

  // 🔹 Manejo de inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhoneChange = (index, value) => {
    const newPhones = [...formData.phones]
    newPhones[index] = value
    setFormData((prev) => ({ ...prev, phones: newPhones }))
  }

  const addPhoneField = () => {
    setFormData((prev) => ({ ...prev, phones: [...prev.phones, ""] }))
  }

  const removePhoneField = (index) => {
    const newPhones = formData.phones.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, phones: newPhones }))
  }

  // 🔹 Guardar usuario
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formData.id) {
        await updateUsuario(formData.id, formData)
        toast.success("Usuario actualizado correctamente")
      } else {
        await createUsuario(formData)
        toast.success("Usuario creado correctamente")
      }
      setIsModalOpen(false)
      setIsEditing(false)
      setFormData({ id: null, username: "", email: "", first_name: "", last_name: "", phones: [""] })
      await loadUsuarios()
    } catch (error) {
      console.error("Error guardando usuario:", error)
      toast.error("Error al guardar usuario")
    }
  }

  // 🔹 Eliminar usuario
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await deleteUsuario(id)
        toast.success("Usuario eliminado correctamente")
        await loadUsuarios()
      } catch (error) {
        console.error("Error eliminando usuario:", error)
        toast.error("Error al eliminar usuario")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Agregar Usuario</span>
        </button>
      </div>

      {/* Tabla usuarios */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {usuarios.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No hay usuarios registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfonos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(usuarios) && usuarios.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-6 py-4">
                      {user.phones?.length > 0 ? user.phones.join(", ") : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          className="text-sky-600 hover:text-sky-900"
                          onClick={() => {
                            setFormData({
                              id: user.id,
                              username: user.username,
                              email: user.email,
                              first_name: user.first_name,
                              last_name: user.last_name,
                              phones: user.phones?.length > 0 ? user.phones : [""]
                            })
                            setIsEditing(true)
                            setIsModalOpen(true)
                          }}
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(user.id)}
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
      {/* ... Modal se queda igual ... */}
    </div>
  )
}
