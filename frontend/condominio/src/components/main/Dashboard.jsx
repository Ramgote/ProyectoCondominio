import React from "react";

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-sky-800 mb-4">Panel de Control</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold text-gray-700">Residentes</h2>
          <p className="text-gray-500">Gestión de los residentes del condominio</p>
        </div>
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold text-gray-700">Vehículos</h2>
          <p className="text-gray-500">Control de vehículos registrados</p>
        </div>
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold text-gray-700">Reportes</h2>
          <p className="text-gray-500">Resumen de actividades y estadísticas</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
