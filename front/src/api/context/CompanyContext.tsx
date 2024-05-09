import { createContext, useContext, useState } from "react";
import { getCompaniesRequest, getCompanyRequest } from "../company.js";


const CompanyContext = createContext();

export const useCompany = () => {
    const context = useContext(CompanyContext);

    if (!context) {
        throw new Error("useCompany must be used within an CompanyProvider");
    }
    return useContext(CompanyContext);
};

export function CompanyProvider({ children }) {
    const [companies, setCompanies] = useState([]);

    const getUsers = async () => {
        try {
            const res = await getCompaniesRequest();
            console.log(res)
            setCompanies(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getCompany = async (id) => {
        try {
            const res = await getCompanyRequest(id);
            console.log(res)
            // setCompanies(res.data);
        } catch (error) {
            console.log(error);
        }
    };


    return <CompanyContext.Provider value={{
        companies, getUsers, getCompany
    }}>{children}</CompanyContext.Provider>;

}