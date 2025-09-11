import { useEffect, useState } from "react"
import { getResidentes } from "../api/residentes"

export default function ResidenteList(){

    const [residentes, setResidentes] = useState([])
    
    const loadResidentes = async (params) => {

        const response = await getResidentes()
        setResidentes(response.data)
    }

    useEffect(() => {
        loadResidentes()
    }, [])

    return (
        <div className="mt-8">
            <h1 className = "text-3xl font-bold text-sky-800">Residentes activos</h1>
            <div>
                { residentes.map(residente => (
                    <div key={residente.id}>
                        <p>{residente.nombre}</p>
                        <p>{residente.apPaterno}</p>
                        <p>{residente.apMaterno}</p>
                    </div>
                ))}
            </div>
        </div>        
    )
}