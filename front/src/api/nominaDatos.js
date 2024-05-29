import axios from "./axios.js";

// Periodo liquidacion
export const getPeriodosRequest = async () => axios.get(`/nominaDatos/periodos`);
export const getPeriodoRequest = async (id) => axios.get(`/nominaDatos/periodos/${id}`);
export const createPeriodoRequest = async (periodo) => axios.post("/nominaDatos/periodos", periodo);
export const updatePeriodoRequest = async (id, periodo) => axios.put(`/nominaDatos/periodos/${id}`, periodo);
export const deletePeriodoRequest = async (id) => axios.delete(`/nominaDatos/periodos/${id}`);

// Dashboard
export const getTotalesRequest = async () => axios.get(`/nominaDatos/dashboard`);
