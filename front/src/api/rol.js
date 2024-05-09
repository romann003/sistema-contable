import axios from "./axios.js";

export const getRolesRequest = async () => axios.get(`/roles`);