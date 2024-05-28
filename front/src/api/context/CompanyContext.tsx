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
    const getCompanies = async () => {
        try {
            const res = await getCompaniesRequest();
            setCompanies(res.data);
        } catch (error) {
            handleRequestError(error);

        }
    }

    //?------------------------ get by id ------------------------
    const getCompany = async (id) => {
        try {
            const res = await getCompanyRequest(id);
            setCompanies(res.data);
        } catch (error) {
            handleRequestError(error);

        }
    }

    //?------------------------ update ------------------------
    const updateCompany = async (id, company) => {
        try {
            const res = await updateCompanyRequest(id, company);
            handleRequestSuccess(res.status, 'Empresa Actualizada Exitosamente');
            // setCompanies(companies)
        } catch (error) {
            handleRequestError(error);

        }
    }

    useEffect(handleErrorsLifeCycle, [errors]);

    return <CompanyContext.Provider value={{
        companies, setCompanies, getCompanies, getCompany, updateCompany, errors
    }}>
        <Toast ref={toast} />
        {children}
    </CompanyContext.Provider>;

}