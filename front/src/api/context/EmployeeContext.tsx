import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getEmployeesRequest, getEmployeeRequest, createEmployeeRequest, updateEmployeeRequest, deleteEmployeeRequest } from "../employee.js";
import { Toast } from 'primereact/toast';

const EmployeeContext = createContext();

export const useEmployees = () => {
    const context = useContext(EmployeeContext);
    if (!context) {
        throw new Error("useEmployee must be used within an EmployeeProvider");
    }
    return context;
};

export function EmployeeProvider({ children }) {
    const [errors, setErrors] = useState([]);
    const [employees, setEmployees] = useState([]);
    const toast = useRef<Toast>(null);

    //?------------------------ get ------------------------
    const getEmployees = async () => {
        try {
            const res = await getEmployeesRequest();
            setEmployees(res.data);
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    //?------------------------ get by id ------------------------
    const getEmployee = async (id) => {
        try {
            const res = await getEmployeeRequest(id);
            setEmployees(res.data);
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    //?------------------------ create ------------------------
    const createEmployee = async (employee) => {
        try {
            const res = await createEmployeeRequest(employee);

            if (res.status === 200) {
                toast.current?.show({ severity: 'success', summary: 'Exito', detail: 'Empleado Creado Exitosamente', life: 3000 });
                // window.location.reload();
                setEmployees(employees)
            }
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    //?------------------------ update ------------------------
    const updateEmployee = async (id, employee) => {
        try {
            const res = await updateEmployeeRequest(id, employee);
            if (res.status === 200) {
                toast.current?.show({ severity: 'success', summary: 'Exito', detail: 'Empleado Actualizado Exitosamente', life: 3000 });
                // window.location.reload();
                setEmployees(employees)
            }
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    //?------------------------ delete ------------------------
    const deleteEmployee = async (id) => {
        try {
            const res = await deleteEmployeeRequest(id);
            if (res.status === 200) {
                toast.current?.show({ severity: 'success', summary: 'Exito', detail: 'Empleado Eliminado Exitosamente', life: 3000 });
                setEmployees(employees.filter((val) => val.id !== id));
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
        <EmployeeContext.Provider
            value={{
                errors, employees, setEmployees, getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee
            }}
        >
            <Toast ref={toast} />
            {errors.map((error) => (
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error, life: 5000 })
            ))}
            {children}
        </EmployeeContext.Provider>
    );
}