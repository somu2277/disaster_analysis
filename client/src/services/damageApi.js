import apiClient from './apiClient';

export const analyzeDamage = (formData) => 
  apiClient.post('/damage/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getDamageHistory = () => 
  apiClient.get('/damage/history');

export const getDamageAnalysis = (id) => 
  apiClient.get(`/damage/${id}`);
