import axios from "./axios.js";

export const getEmployeesRequest = async () => axios.get(`/employees`);
export const getEmployeeRequest = async (id) => axios.get(`/employees/${id}`);
export const createEmployeeRequest = async (employee) => axios.post("/employees", employee);
export const updateEmployeeRequest = async (id, employee) => axios.put(`/employees/${id}`, employee);
export const deleteEmployeeRequest = async (id) => axios.delete(`/employees/${id}`);