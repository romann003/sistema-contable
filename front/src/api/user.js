import axios from "./axios.js";

export const getUsersRequest = async () => axios.get(`/users`);
export const getUserRequest = async (id) => axios.get(`/users/${id}`);
export const createUserRequest = async (user) => axios.post("/users", user);
export const updateCompanyRequest = async (id, user) => axios.put(`/users/${id}`, user);
export const deleteUserRequest = async (id) => axios.delete(`/users/${id}`);