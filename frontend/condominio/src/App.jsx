import React, { useEffect } from 'react'; // <--- ¡Importar useEffect de React!
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import RequireAuth from "./components/auth/RequireAuth";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./components/main/Dashboard";
import PropiedadList from "./components/propiedades/PropiedadList";
import ResidenteList from "./components/residentes/ResidenteList";
import VehiculosList from "./components/vehiculos/VehiculosList";
import UsuariosList from "./components/usuarios/usuarioList";
import BitacoraList from "./components/Bitacora/BitacoraList";

// <--- ¡Importar loadAuthToken desde la ubicación correcta!
// Asumiendo que 'propiedades.js' está en 'src/api/propiedades.js'
import { loadAuthToken } from './api/propiedades'; 
// Si tu archivo propiedades.js está en otra ubicación, ajusta esta ruta.
// Por ejemplo, si está en 'src/utils/api/propiedades.js', sería './utils/api/propiedades'.

function App() {
  useEffect(() => {
    console.log("App.jsx: Intentando cargar token de autenticación...");
    loadAuthToken(); // Carga el token al iniciar la app
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas dentro del Dashboard */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/propiedades"
          element={
            <RequireAuth>
              <DashboardLayout>
                <PropiedadList />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/usuarios"
          element={
            <RequireAuth>
              <DashboardLayout>
                <UsuariosList />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/residentes"
          element={
            <RequireAuth>
              <DashboardLayout>
                <ResidenteList />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/vehiculos"
          element={
            <RequireAuth>
              <DashboardLayout>
                <VehiculosList />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/bitacora"
          element={
            <RequireAuth>
              <DashboardLayout>
                <BitacoraList />
              </DashboardLayout>
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;