import axios from 'axios'

const residentesApi = axios.create({
    baseURL: "http://localhost:8000/api/residentes/residentes"
})

export const getResidentes = () => residentesApi.get()