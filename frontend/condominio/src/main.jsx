import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import ResidenteList from './components/ResidenteList'
import VehiculosList from './components/vehiculos/VehiculosList'
import DefaultLayout from './components/layout/DefaultLayout'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<ResidenteList />} />
          <Route path="/residentes/:residenteId/vehiculos" element={<VehiculosList />} />
        </Routes>
      </DefaultLayout>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  </StrictMode>,
)
