import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getCompanyRequest, updateCompanyRequest, getCompaniesRequest } from "../company.js";
import { Toast } from 'primereact/toast';


const CompanyContext = createContext();

export const useCompany = () => {
    const context = useContext(CompanyContext);
    if (!context) {
        throw new Error("useCompany must be used within an CompanyProvider");
    }
    return context;
};

export function CompanyProvider({ children }) {
    const [errors, setErrors] = useState([]);
    const [companies, setCompanies] = useState([]);
    const toast = useRef<Toast>(null);

    //?------------------------ get ------------------------
const getCompanies = async () => {
    try {
        const res = await getCompaniesRequest();
        setCompanies(res.data);
    } catch (error) {
        if (Array.isArray(error.response.data)) {
            return setErrors(error.response.data);
        }
        setErrors([error.response.data.message]);
    }
}

    //?------------------------ get by id ------------------------
    const getCompany = async (id) => {
        try {
            const res = await getCompanyRequest(id);
            setCompanies(res.data);
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }

    //?------------------------ update ------------------------
    const updateCompany = async (id, company) => {
        try {
            const res = await updateCompanyRequest(id, company);
            if (res.status === 200) {
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Empresa Actualizada', life: 3000 });
                window.location.reload();
            }
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    }


    return <CompanyContext.Provider value={{
        companies, setCompanies, getCompanies, getCompany, updateCompany, errors
    }}>
        <Toast ref={toast} />
        {errors.map((error) => (
            toast.current?.show({ severity: 'error', summary: 'Error', detail: error, life: 5000 })
        ))}
        {children}
    </CompanyContext.Provider>;

}