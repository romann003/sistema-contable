import axios from "./axios.js";

export const getCompaniesRequest = async () => axios.get(`/company`);
export const getCompanyRequest = async (id) => axios.get(`/company/${id}`);
export const getCompanyReportesRequest = async (id) => axios.get(`/company/reports/company/${id}`);
export const updateCompanyRequest = async (id, company) => axios.put(`/company/${id}`, company);
