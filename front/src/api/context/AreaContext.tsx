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

    const handleRequestError = (error) => {
        if (Array.isArray(error.response.data)) {
            setErrors(error.response.data);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data, life: 5000 });
        } else {
            setErrors(error.response.data.message);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data.message, life: 5000 });
        }
    };

    const handleRequestSuccess = (status, successMessage) => {
        if (status === 200) {
            toast.current?.show({ severity: 'success', summary: 'Exito', detail: successMessage, life: 3000 });
        }
    };

    const handleErrorsLifeCycle = () => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 200);
            return () => clearTimeout(timer);
        }
    };

    //?------------------------ get ------------------------
    const getAreas = async () => {
        try {
            const res = await getAreasRequest();
            setAreas(res.data);
        } catch (error) {
            handleRequestError(error);

        }
    }

    //?------------------------ get by id ------------------------
    const getAreasById = async (id) => {
        try {
            const res = await getAreasByIdRequest(id);
            setAreas(res.data);
        } catch (error) {
            handleRequestError(error);

        }
    }

    const getArea = async (id) => {
        try {
            const res = await getAreaRequest(id);
            setAreas(res.data);
        } catch (error) {
            handleRequestError(error);

        }
    }

    //?------------------------ create ------------------------
    const createArea = async (area) => {
        try {
            const res = await createAreaRequest(area);
            handleRequestSuccess(res.status, 'Puesto Creado Exitosamente');
            // setAreas(areas)
        } catch (error) {
            handleRequestError(error);

        }
    }

    //?------------------------ update ------------------------
    const updateArea = async (id, area) => {
        try {
            const res = await updateAreaRequest(id, area);
            handleRequestSuccess(res.status, 'Puesto Actualizado Exitosamente');
            // setAreas(areas)
        } catch (error) {
            handleRequestError(error);

        }
    }

    //?------------------------ delete ------------------------
    const deleteArea = async (id) => {
        try {
            const res = await deleteAreaRequest(id);
            handleRequestSuccess(res.status, 'Puesto Eliminado Exitosamente');
            setAreas(areas.filter((val) => val.id !== id));
        } catch (error) {
            handleRequestError(error);

        }
    }

    //?------------------------ useEffect (errors) ------------------------
    useEffect(handleErrorsLifeCycle, [errors]);


    return (
        <AreaContext.Provider value={{
            areas, setAreas, getAreas, getAreasById, getArea, createArea, deleteArea, updateArea, errors
        }}>
            <Toast ref={toast} />

            {children}
        </AreaContext.Provider>
    )
}