import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});
axios.defaults.withCredentials = true;

export default api;
