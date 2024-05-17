import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getAreasRequest, getAreaRequest, createAreaRequest, updateAreaRequest, deleteAreaRequest, getAreasByIdRequest } from "../area.js";
import { Toast } from 'primereact/toast';

const AreaContext = createContext();

export const useAreas = () => {
    const context = useContext(AreaContext);
    if (!context) {
        throw new Error("useAreas must be used within an AreaProvider");
    }
    return context;
}

export function AreaProvider({ children }) {
    const [errors, setErrors] = useState([]);
    const [areas, setAreas] = useState([]);
    const toast = useRef<Toast>(null);

    //?------------------------ get ------------------------
    const getAreas = async () => {
        try {
            const res = await getAreasRequest();
            setAreas(res.data);
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    //?------------------------ get by id ------------------------
    const getAreasById = async (id) => {
        try {
            const res = await getAreasByIdRequest(id);
            setAreas(res.data);
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    const getArea = async (id) => {
        try {
            const res = await getAreaRequest(id);
            setAreas(res.data);
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    //?------------------------ create ------------------------
    const createArea = async (area) => {
        try {
            const res = await createAreaRequest(area);

            if (res.status === 200) {
                toast.current?.show({ severity: 'success', summary: 'Exito', detail: 'Area Creada Exitosamente', life: 3000 });
                // window.location.reload();
                setAreas(areas)
            }
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    //?------------------------ update ------------------------
    const updateArea = async (id, area) => {
        try {
            const res = await updateAreaRequest(id, area);
            if (res.status === 200) {
                toast.current?.show({ severity: 'success', summary: 'Exito', detail: 'Area Actualizada Exitosamente', life: 3000 });
                // window.location.reload();
                setAreas(areas)
            }
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    //?------------------------ delete ------------------------
    const deleteArea = async (id) => {
        try {
            const res = await deleteAreaRequest(id);
            if (res.status === 200) {
                toast.current?.show({ severity: 'success', summary: 'Exito', detail: 'Area Eliminada Exitosamente', life: 3000 });
                setAreas(areas.filter((val) => val.id !== id));
            }
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    //?------------------------ useEffect (errors) ------------------------
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    return (
        <AreaContext.Provider value={{
            areas, setAreas, getAreas, getAreasById, getArea, createArea, deleteArea, updateArea, errors
        }}>
            <Toast ref={toast} />
            {errors.map((error) => (
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error, life: 5000 })
            ))}
            {children}
        </AreaContext.Provider>
    )
}