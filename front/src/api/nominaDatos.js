import axios from "./axios.js";

// Periodo liquidacion
export const getPeriodosRequest = async () => axios.get(`/nominaDatos/periodos`);
export const getPeriodoRequest = async (id) => axios.get(`/nominaDatos/periodos/${id}`);
export const createPeriodoRequest = async (periodo) => axios.post("/nominaDatos/periodos", periodo);
export const updatePeriodoRequest = async (id, periodo) => axios.put(`/nominaDatos/periodos/${id}`, periodo);
export const deletePeriodoRequest = async (id) => axios.delete(`/nominaDatos/periodos/${id}`);

// Bonificaciones
export const getBonificacionesRequest = async (nominaId) => axios.get(`/nominaDatos/bonificaciones/${nominaId}`);
// export const getBonificacionesRequest = async () => axios.get("/nominaDatos/bonificaciones");
export const createBonificacionRequest = async (bonificacion) => axios.post("/nominaDatos/bonificaciones", bonificacion);
export const updateBonificacionRequest = async (id, bonificacion) => axios.put(`/nominaDatos/bonificaciones/${id}`, bonificacion);
export const deleteBonificacionRequest = async (id) => axios.delete(`/nominaDatos/bonificaciones/${id}`);