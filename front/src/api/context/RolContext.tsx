import { createContext, useContext, useState } from "react";
import {getRolesRequest} from "../rol.js";


const RolContext = createContext();

export const useRoles = () => {
    const context = useContext(RolContext);
    if (!context) {
        throw new Error("useRoles must be used within an RolesProvider");
    }
    return context;
}

export function RolesProvider({ children }) {
    const [roles, setRoles] = useState([]);

    const getRoles = async () => {
        try {
            const res = await getRolesRequest();
            setRoles(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <RolContext.Provider value={{
            roles, setRoles, getRoles
        }}>
            {children}
        </RolContext.Provider>
    )
}