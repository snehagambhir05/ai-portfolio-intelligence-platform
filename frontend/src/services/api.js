import axios from "axios";

const API = axios.create({
  baseURL: "https://YOUR-BACKEND.onrender.com"
});

export default API;