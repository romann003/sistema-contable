import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getUsersRequest, getUserRequest, createUserRequest, updateUserRequest, deleteUserRequest } from "../user.js";
import { Toast } from 'primereact/toast';

const UserContext = createContext();

export const useUsers = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within an UserProvider");
    }
    return context;
}

export function UserProvider({ children }) {
    const [errors, setErrors] = useState([]);
    const [users, setUsers] = useState([]);
    const toast = useRef<Toast>(null);

    //?------------------------ get ------------------------
    const getUsers = async () => {
        try {
            const res = await getUsersRequest();
            setUsers(res.data);
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    //?------------------------ get by id ------------------------
    const getUser = async (id) => {
        try {
            const res = await getUserRequest(id);
            setUsers(res.data);
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    //?------------------------ create ------------------------
    const createUser = async (user) => {
        try {
            const res = await createUserRequest(user);

            if (res.status === 200) {
                toast.current?.show({ severity: 'success', summary: 'Exito', detail: 'Usuario Creado Exitosamente', life: 3000 });
                window.location.reload();
            }
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    //?------------------------ update ------------------------
    const updateUser = async (id, user) => {
        try {
            const res = await updateUserRequest(id, user);
            if (res.status === 200) {
                toast.current?.show({ severity: 'success', summary: 'Exito', detail: 'Usuario Actualizado Exitosamente', life: 3000 });
                window.location.reload();
            }
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    //?------------------------ delete ------------------------
    const deleteUser = async (id) => {
        try {
            const res = await deleteUserRequest(id);
            if (res.status === 200) {
                toast.current?.show({ severity: 'success', summary: 'Exito', detail: 'Usuario Eliminado Exitosamente', life: 3000 });
                setUsers(users.filter((val) => val.id !== id));
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
        <UserContext.Provider value={{
            users, setUsers, getUsers, getUser, createUser, deleteUser, updateUser, errors
        }}>
            <Toast ref={toast} />
            {errors.map((error) => (
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error, life: 5000 })
            ))}
            {children}
        </UserContext.Provider>
    )
}