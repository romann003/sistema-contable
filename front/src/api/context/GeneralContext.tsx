import { createContext, useContext } from "react";
import { CompanyProvider } from "./CompanyContext";
import { UserProvider } from "./UsersContext";
import { RolesProvider } from "./RolContext";
import { DepartmentProvider } from "./DepartmentContext";
import { AreaProvider } from "./AreaContext";
import { AuthProvider } from "./AuthContext";

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
            <AuthProvider>
                <CompanyProvider>
                    <UserProvider>
                        <RolesProvider>
                            <DepartmentProvider>
                                <AreaProvider>
                                    {children}
                                </AreaProvider>
                            </DepartmentProvider>
                        </RolesProvider>
                    </UserProvider>
                </CompanyProvider>
            </AuthProvider>
        </GeneralContext.Provider>
    )
}