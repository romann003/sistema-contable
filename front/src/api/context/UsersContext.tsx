import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getUsersRequest, getUserRequest, createUserRequest, updateCompanyRequest, deleteUserRequest } from "../user.js";
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

    const createUser = async (user) => {
        try {
            const res = await createUserRequest(user);

            if(res.status === 200){
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Usuario Creado', life: 3000 });
                window.location.reload();
            };


        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    const updateUser = async (id, user) => {
        try {
            const res = await updateCompanyRequest(id, user);
            console.log(res.data)
            // setUsers(res.data);
            if(res.status === 200){
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Usuario Actualizado', life: 3000 });
                window.location.reload();
            };
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    const deleteUser = async (id) => {
        try {
            const res = await deleteUserRequest(id);
            // if(res.status === 204) setUsers(users.filter((u) => u.id !== id));
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
        
        <UserContext.Provider value={{
            users, setUsers, getUsers, getUser, createUser, deleteUser, updateUser, errors
        }}>
            <Toast ref={toast} />
            {children}
        </UserContext.Provider>
    )
}