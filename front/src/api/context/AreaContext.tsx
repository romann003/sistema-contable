import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getAreasRequest, getAreaRequest, createAreaRequest, updateAreaRequest, deleteAreaRequest } from "../area.js";
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

    const createArea = async (area) => {
        try {
            const res = await createAreaRequest(area);

            if (res.status === 200) {
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Area Creada', life: 3000 });
                window.location.reload();
            };
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                // return toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data, life: 3000 });
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    const updateArea = async (id, area) => {
        try {
            const res = await updateAreaRequest(id, area);
            // setAreas(res.data);
            if (res.status === 200) {
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Area Actualizada', life: 3000 });
                window.location.reload();
            };
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                // return toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data, life: 3000 });
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    const deleteArea = async (id) => {
        try {
            const res = await deleteAreaRequest(id);
            // if(res.status === 204) setAreas(areas.filter((u) => u.id !== id));
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }


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
            areas, setAreas, getAreas, getArea, createArea, deleteArea, updateArea, errors
        }}>
            <Toast ref={toast} />
            {children}
        </AreaContext.Provider>
    )
}