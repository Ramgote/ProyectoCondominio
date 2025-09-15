import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaCar,
  FaSignOutAlt,
  FaUsersCog,
  FaListAlt,
} from "react-icons/fa";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true); // estado sidebar en desktop
  const [isMobileOpen, setIsMobileOpen] = useState(false); // estado sidebar en mobile

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { label: "Inicio", icon: <FaHome />, path: "/" },
    { label: "Propiedades", icon: <FaHome />, path: "/propiedades" },
    { label: "Usuarios", icon: <FaUsersCog />, path: "/usuarios" },
    { label: "Residentes", icon: <FaUsers />, path: "/residentes" },
    { label: "Vehículos", icon: <FaCar />, path: "/vehiculos" },
    { label: "Bitacora", icon: <FaListAlt />, path: "/bitacora" },
  ];

  const SidebarContent = ({ mobile }) => (
    <div
      className={`${
        mobile ? "w-64" : isOpen ? "w-64" : "w-20"
      } bg-sky-800 text-white flex flex-col h-full transition-all duration-300`}
    >
      {/* Header del sidebar */}
      <div className="flex items-center justify-between p-4 border-b border-sky-700">
        <span className={`${mobile || isOpen ? "block" : "hidden"} font-bold text-lg`}>
          Condominio
        </span>
        <button
          onClick={() => (mobile ? setIsMobileOpen(false) : setIsOpen(!isOpen))}
          className="text-white focus:outline-none"
        >
          {mobile ? <FaTimes /> : isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Items del menú */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              navigate(item.path);
              if (mobile) setIsMobileOpen(false);
            }}
            className="flex items-center gap-3 w-full text-left px-3 py-2 rounded hover:bg-sky-700 transition"
          >
            {item.icon}
            {(mobile || isOpen) && item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sky-700">
        <button
          onClick={() => {
            handleLogout();
            if (mobile) setIsMobileOpen(false);
          }}
          className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-sky-700 transition"
        >
          <FaSignOutAlt />
          {(mobile || isOpen) && "Cerrar sesión"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar en Desktop */}
      <aside className="hidden md:flex">
        <SidebarContent mobile={false} />
      </aside>

      {/* Botón Hamburguesa en móvil */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="text-sky-800 text-2xl focus:outline-none"
        >
          <FaBars />
        </button>
      </div>

      {/* Sidebar en Mobile (overlay) */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="absolute left-0 top-0 h-full">
            <SidebarContent mobile={true} />
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <main className="flex-1 p-6 overflow-auto w-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
