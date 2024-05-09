import axios from "./axios.js";

export const getCompaniesRequest = () => axios.get(`/users`);
export const getCompanyRequest = (id) => axios.get(`/users/${id}`);
export const updateCompanyRequest = (company) => axios.put(`/company/${company.id}`, company);