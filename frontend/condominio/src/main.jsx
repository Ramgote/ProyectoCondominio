import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ResidenteList from './components/ResidenteList'
import DefaultLayout from './layouts/Defaultlayout'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DefaultLayout />
  </StrictMode>,
)
