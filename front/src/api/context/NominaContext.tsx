import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Toast } from 'primereact/toast';
import { getNominaRequest, getNominasRequest, createNominaRequest, updateNominaRequest, deleteNominaRequest } from "../nomina.js";

const NominaContext = createContext();

export const useNominas = () => {
    const context = useContext(NominaContext);
    if (!context) {
        throw new Error("useNominas must be used within a NominaProvider");
    }
    return context;
}

export function NominaProvider({ children }) {
    const [errors, setErrors] = useState([]);
    const [nominas, setNominas] = useState([]);
    const [nominaId, setNominaId] = useState(null);
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
    const getNominas = async () => {
        try {
            const res = await getNominasRequest();
            setNominas(res.data);
        } catch (error) {
            handleRequestError(error);
        }
    }

    const getNomina = async () => {
        try {
            const res = await getNominaRequest(nominaId);
            return res.data;
        } catch (error) {
            handleRequestError(error);
        }
    }

    //?------------------------ post ------------------------
    const createNomina = async (nomina) => {
        try {
            const res = await createNominaRequest(nomina);
            handleRequestSuccess(res.status, 'Nomina creada con exito');
            setNominaId(res.data.id);
            // console.log(res.data);
        } catch (error) {
            handleRequestError(error);
        }
    }

    //?------------------------ put ------------------------
    const updateNomina = async (id, nomina) => {
        try {
            const res = await updateNominaRequest(id, nomina);
            handleRequestSuccess(res.status, 'Nomina Actualizada Exitosamente');
            // setDepartments(departments);
        } catch (error) {
            handleRequestError(error);
        }
    }

    //?------------------------ delete ------------------------
    const deleteNomina = async (id) => {
        try {
            const res = await deleteNominaRequest(id);
            handleRequestSuccess(res.status, 'Nomina eliminada con exito');
            setNominas(nominas.filter((n) => n.id !== id));
        } catch (error) {
            handleRequestError(error);
        }
    }

    useEffect(handleErrorsLifeCycle, [errors]);

    return (
        <NominaContext.Provider value={{ nominaId, setNominaId,
            nominas, setNominas, getNominas, getNomina, createNomina, updateNomina, deleteNomina }}>
            <Toast ref={toast} />
            {children}
        </NominaContext.Provider>
    );
}