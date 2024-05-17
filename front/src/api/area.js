import axios from "./axios.js";

export const getAreasRequest = async () => axios.get(`/areas`);
export const getAreasByIdRequest = async (id) => axios.get(`/areas/department/${id}`);
export const getAreaRequest = async (id) => axios.get(`/areas/${id}`);
export const createAreaRequest = async (area) => axios.post("/areas", area);
export const updateAreaRequest = async (id, area) => axios.put(`/areas/${id}`, area);
export const deleteAreaRequest = async (id) => axios.delete(`/areas/${id}`);