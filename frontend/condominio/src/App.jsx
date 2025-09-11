import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import ResidenteList from './components/residentes/ResidenteList';
import VehiculosList from './components/vehiculos/VehiculosList';
import DefaultLayout from './components/layout/DefaultLayout';
import RequireAuth from './components/auth/RequireAuth';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <DefaultLayout>
                <ResidenteList />
              </DefaultLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/residentes/:residenteId/vehiculos"
          element={
            <RequireAuth>
              <DefaultLayout>
                <VehiculosList />
              </DefaultLayout>
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
