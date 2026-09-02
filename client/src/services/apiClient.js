import axios from 'axios';

let apiUrl = import.meta.env.VITE_API_URL || 'https://disasteranalysis.onrender.com/api';
if (apiUrl && !apiUrl.endsWith('/api') && !apiUrl.includes('/api/')) {
  apiUrl = `${apiUrl.replace(/\/$/, '')}/api`;
}

const apiClient = axios.create({
  baseURL: apiUrl,
});

export default apiClient;
