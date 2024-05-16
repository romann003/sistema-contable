import { createContext, useContext, useEffect, useRef, useState } from "react";
import {getRolesRequest} from "../rol.js";
import { Toast } from 'primereact/toast';


const RolContext = createContext();

export const useRoles = () => {
    const context = useContext(RolContext);
    if (!context) {
        throw new Error("useRoles must be used within an RolesProvider");
    }
    return context;
}

export function RolesProvider({ children }) {
    const [errors, setErrors] = useState([]);
    const [roles, setRoles] = useState([]);
    const toast = useRef<Toast>(null);


    const getRoles = async () => {
        try {
            const res = await getRolesRequest();
            setRoles(res.data);
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
        <RolContext.Provider value={{
            roles, setRoles, getRoles, errors
        }}>
            <Toast ref={toast} />
            {errors.map((error) => (
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error, life: 5000 })
            ))}
            {children}
        </RolContext.Provider>
    )
}