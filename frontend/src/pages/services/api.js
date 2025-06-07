import axios from "axios";

const API = axios.create({
  baseURL: Process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;