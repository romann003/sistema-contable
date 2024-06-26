import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Toast } from 'primereact/toast';

import {
    //periodos
    getPeriodosRequest, getPeriodoRequest, createPeriodoRequest, updatePeriodoRequest, deletePeriodoRequest
    //Dashboard
    , getTotalesRequest
} from "../nominaDatos.js";

const NominaDatosContext = createContext();

export const useNominaDatos = () => {
    const context = useContext(NominaDatosContext);
    if (!context) {
        throw new Error("useNominaDatos must be used within a NominaDatosProvider");
    }
    return context;
}

export function NominaDatosProvider({ children }) {
    const [errors, setErrors] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [totales, setTotales] = useState([]);
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

    //! ------------------------ PERIODOS DE FECHA ------------------------

    //?------------------------ get ------------------------
    const getPeriodos = async () => {
        try {
            const res = await getPeriodosRequest();
            setPeriodos(res.data);
        } catch (error) {
            handleRequestError(error);
        }
    }

    const getPeriodo = async (id) => {
        try {
            const res = await getPeriodoRequest(id);
            setPeriodos(res.data);
        } catch (error) {
            handleRequestError(error);
        }
    }

    //?------------------------ create ------------------------
    const createPeriodo = async (periodo) => {
        try {
            const res = await createPeriodoRequest(periodo);
            handleRequestSuccess(res.status, 'Periodo de liquidación creado exitosamente');
            // setPeriodos(periodos);
        } catch (error) {
            handleRequestError(error);
        }
    }

    //?------------------------ update ------------------------
    const updatePeriodo = async (id, periodo) => {
        try {
            const res = await updatePeriodoRequest(id, periodo);
            handleRequestSuccess(res.status, 'Periodo de liquidación actualizado exitosamente');
            // setPeriodos(periodos);
        } catch (error) {
            handleRequestError(error);
        }
    }

    //?------------------------ delete ------------------------
    const deletePeriodo = async (id) => {
        try {
            const res = await deletePeriodoRequest(id);
            handleRequestSuccess(res.status, 'Periodo de liquidación eliminado exitosamente');
            setPeriodos(periodos.filter((val) => val.id !== id));
        } catch (error) {
            handleRequestError(error);
        }
    }

    //! ------------------------ TOTALES ------------------------
    //?------------------------ get ------------------------
    const getTotales = async () => {
        try {
            const res = await getTotalesRequest();
            setTotales(res.data);
        } catch (error) {
            handleRequestError(error);
        }
    }

    //?------------------------ useEffect (errors) ------------------------
    useEffect(handleErrorsLifeCycle, [errors]);

    return (
        <NominaDatosContext.Provider value={{
            //periodos
            periodos, setPeriodos, getPeriodos, getPeriodo, createPeriodo, updatePeriodo, deletePeriodo, errors
            //totales
            , totales, getTotales
        }}>
            <Toast ref={toast} />
            {children}
        </NominaDatosContext.Provider>
    );

}