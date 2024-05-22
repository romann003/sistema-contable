import axios from "./axios.js";

export const getNominasRequest = async () => axios.get(`/nominas`);
export const getNominaRequest = async (id) => axios.get(`/nominas/${id}`);
export const createNominaRequest = async (nomina) => axios.post("/nominas", nomina);
export const updateNominaRequest = async (id, nomina) => axios.put(`/nominas/${id}`, nomina);
export const deleteNominaRequest = async (id) => axios.delete(`/nominas/${id}`);