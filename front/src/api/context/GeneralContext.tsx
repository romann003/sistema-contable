import { createContext, useContext } from "react";
import { CompanyProvider } from "./CompanyContext";
import { UserProvider } from "./UsersContext";
import { RolesProvider } from "./RolContext";

const GeneralContext = createContext();

export const useGeneral = () => {
    const context = useContext(GeneralContext);
    if (!context) {
        throw new Error("useGeneral must be used within an GeneralProvider");
    }
    return context;
}

export function GeneralProvider({ children }) {
    return (
        <GeneralContext.Provider value={{}}>
            <CompanyProvider>
                <UserProvider>
                    <RolesProvider>
                        {children}
                    </RolesProvider>
                </UserProvider>
            </CompanyProvider>
        </GeneralContext.Provider>
    )
}