import axios from "./axios.js";

export const getDepartmentsRequest = async () => axios.get(`/departments`);
export const getActiveDepartmentsRequest = async () => axios.get(`/departments/department`);
export const getDepartmentRequest = async (id) => axios.get(`/departments/${id}`);
export const createDepartmentRequest = async (department) => axios.post("/departments", department);
export const updateDepartmentRequest = async (id, department) => axios.put(`/departments/${id}`, department);
export const deleteDepartmentRequest = async (id) => axios.delete(`/departments/${id}`);