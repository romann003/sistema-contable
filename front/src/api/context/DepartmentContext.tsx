import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getDepartmentsRequest, getDepartmentRequest, createDepartmentRequest, updateDepartmentRequest, deleteDepartmentRequest, getActiveDepartmentsRequest } from "../department.js";
import { Toast } from 'primereact/toast';

const DepartmentContext = createContext();

export const useDepartments = () => {
    const context = useContext(DepartmentContext);
    if (!context) {
        throw new Error("useDepartments must be used within a DepartmentProvider");
    }
    return context;
}

export function DepartmentProvider({ children }) {
    const [errors, setErrors] = useState([]);
    const [departments, setDepartments] = useState([]);
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
    const getDepartments = async () => {
        try {
            const res = await getDepartmentsRequest();
            setDepartments(res.data);
        } catch (error) {
            handleRequestError(error);
        }
    }

    const getActiveDepartments = async () => {
        try {
            const res = await getActiveDepartmentsRequest();
            setDepartments(res.data);
        } catch (error) {
            handleRequestError(error);
        }
    }

    //?------------------------ get by id ------------------------
    const getDepartment = async (id) => {
        try {
            const res = await getDepartmentRequest(id);
            setDepartments(res.data);
        } catch (error) {
            handleRequestError(error);
        }
    }

    //?------------------------ create ------------------------
    const createDepartment = async (department) => {
        try {
            const res = await createDepartmentRequest(department);
            handleRequestSuccess(res.status, 'Departamento Creado Exitosamente');
            // setDepartments(departments);
        } catch (error) {
            handleRequestError(error);
        }
    }

    //?------------------------ update ------------------------
    const updateDepartment = async (id, department) => {
        try {
            const res = await updateDepartmentRequest(id, department);
            handleRequestSuccess(res.status, 'Departamento Actualizado Exitosamente');
            // setDepartments(departments);
        } catch (error) {
            handleRequestError(error);
        }
    }

    //?------------------------ delete ------------------------
    const deleteDepartment = async (id) => {
        try {
            const res = await deleteDepartmentRequest(id);
            handleRequestSuccess(res.status, 'Departamento Eliminado Exitosamente');
            setDepartments(departments.filter((val) => val.id !== id));
        } catch (error) {
            handleRequestError(error);
        }
    }

    //?------------------------ useEffect (errors) ------------------------
    useEffect(handleErrorsLifeCycle, [errors]);

    return (
        <DepartmentContext.Provider value={{
            departments, setDepartments, getDepartments, getDepartment, createDepartment, deleteDepartment, updateDepartment, getActiveDepartments, errors
        }}>
            <Toast ref={toast} />
            {children}
        </DepartmentContext.Provider>
    )
}
