import axios from "./axios.js";

export const registerRequest = (user) => axios.post(`/auth/register`, user);
export const loginRequiest = (user) => axios.post(`/auth/login`, user);
export const verifyTokenRequest = () => axios.get(`/auth/verify`);