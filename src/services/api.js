import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5005', // .NET Core API base URL
});

export default api;
