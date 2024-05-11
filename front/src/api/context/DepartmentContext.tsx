import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getDepartmentsRequest, getDepartmentRequest, createDepartmentRequest, updateDepartmentRequest, deleteDepartmentRequest } from "../department.js";
import { Toast } from 'primereact/toast';


const DepartmentContext = createContext();

export const useDepartments = () => {
    const context = useContext(DepartmentContext);
    if (!context) {
        throw new Error("useDepartments must be used within an DepartmentProvider");
    }
    return context;
}

export function DepartmentProvider({ children }) {
    const [errors, setErrors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const toast = useRef<Toast>(null);

    const getDepartments = async () => {
        try {
            const res = await getDepartmentsRequest();
            setDepartments(res.data);
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    const getDepartment = async (id) => {
        try {
            const res = await getDepartmentRequest(id);
            setDepartments(res.data);
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    const createDepartment = async (department) => {
        try {
            const res = await createDepartmentRequest(department);

            if(res.status === 200){
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Departamento Creado', life: 3000 });
                window.location.reload();
            };


        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    const updateDepartment = async (id, department) => {
        try {
            const res = await updateDepartmentRequest(id, department);
            // setDepartments(res.data);
            if(res.status === 200){
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Departamento Actualizado', life: 3000 });
                window.location.reload();
            };
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    const deleteDepartment = async (id) => {
        try {
            const res = await deleteDepartmentRequest(id);
            // if(res.status === 204) setDepartments(departments.filter((u) => u.id !== id));
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

        <DepartmentContext.Provider value={{
            departments, setDepartments, getDepartments, getDepartment, createDepartment, deleteDepartment, updateDepartment, errors
        }}>
            <Toast ref={toast} />
            {children}
        </DepartmentContext.Provider>
    )
}