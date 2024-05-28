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
    const getEmployees = async () => {
        try {
            const res = await getEmployeesRequest();
            setEmployees(res.data);
        } catch (error) {
            handleRequestError(error);

        }
    }

    //?------------------------ get by id ------------------------
    const getEmployee = async (id) => {
        try {
            const res = await getEmployeeRequest(id);
            setEmployees(res.data);
        } catch (error) {
            handleRequestError(error);

        }
    }

    //?------------------------ create ------------------------
    const createEmployee = async (employee) => {
        try {
            const res = await createEmployeeRequest(employee);
            handleRequestSuccess(res.status, 'Empleado Creado Exitosamente');
            // setEmployees(employees)
        } catch (error) {
            handleRequestError(error);

        }
    }

    //?------------------------ update ------------------------
    const updateEmployee = async (id, employee) => {
        try {
            const res = await updateEmployeeRequest(id, employee);
            handleRequestSuccess(res.status, 'Empleado Actualizado Exitosamente');
        } catch (error) {
            handleRequestError(error);

        }
    }

    //?------------------------ delete ------------------------
    const deleteEmployee = async (id) => {
        try {
            const res = await deleteEmployeeRequest(id);
            handleRequestSuccess(res.status, 'Empleado Eliminado Exitosamente');

            setEmployees(employees.filter((val) => val.id !== id));

        } catch (error) {
            handleRequestError(error);

        }
    }

    //?------------------------ useEffect (errors) ------------------------
    useEffect(handleErrorsLifeCycle, [errors]);

    return (
        <EmployeeContext.Provider
            value={{
                errors, employees, setEmployees, getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee
            }}
        >
            <Toast ref={toast} />
            {children}
        </EmployeeContext.Provider>
    );
}