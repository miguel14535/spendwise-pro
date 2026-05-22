import axios from "axios";

const api = axios.create({
  baseURL: "https://spendwise-backend-fqcl.onrender.com/api",
});

export default api;