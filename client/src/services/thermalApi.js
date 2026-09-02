import apiClient from './apiClient';

export const analyzeThermal = (formData) => 
  apiClient.post('/thermal/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getThermalHistory = () => 
  apiClient.get('/thermal/history');

export const getThermalAnalysis = (id) => 
  apiClient.get(`/thermal/${id}`);
