import axios from 'axios';
const hostname = window.location.hostname;
const dynamicBaseURL = `http://${hostname}:5201/api`;
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || dynamicBaseURL });
export default api;
