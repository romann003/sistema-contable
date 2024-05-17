import axios from "axios";

const instance = axios.create({
    // baseURL: "http://25.58.152.111:3000/api",
    baseURL: "http://localhost:3000/api",
    withCredentials: true
});

export default instance;