import axios from "axios";

const API = axios.create({

  baseURL: "https://quantai-analytics-backend.onrender.com"

});

export default API;