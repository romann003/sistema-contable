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
    const getUsers = async () => {
        try {
            const res = await getUsersRequest();
            setUsers(res.data);
        } catch (error) {
            handleRequestError(error);
        }
    }

    //?------------------------ get by id ------------------------
    const getUser = async (id) => {
        try {
            const res = await getUserRequest(id);
            setUsers(res.data);
        } catch (error) {
            handleRequestError(error);
        }
    }

    //?------------------------ create ------------------------
    const createUser = async (user) => {
        try {
            const res = await createUserRequest(user);
            handleRequestSuccess(res.status, 'Usuario Creado Exitosamente');
            // setUsers(users);
        } catch (error) {
            handleRequestError(error);
        }
    }

    //?------------------------ update ------------------------
    const updateUser = async (id, user) => {
        try {
            const res = await updateUserRequest(id, user);
            handleRequestSuccess(res.status, 'Usuario Actualizado Exitosamente');

        } catch (error) {
            handleRequestError(error);
        }
    }

    //?------------------------ delete ------------------------
    const deleteUser = async (id) => {
        try {
            const res = await deleteUserRequest(id);
            handleRequestSuccess(res.status, 'Usuario Eliminado Exitosamente');
            setUsers(users.filter((val) => val.id !== id));

        } catch (error) {
            handleRequestError(error);
        }
    }

    //?------------------------ useEffect (errors) ------------------------
    useEffect(handleErrorsLifeCycle, [errors]);



    return (
        <UserContext.Provider value={{
            users, setUsers, getUsers, getUser, createUser, deleteUser, updateUser, errors
        }}>
            {children}
        </UserContext.Provider>
    )
}