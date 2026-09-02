import apiClient from './apiClient';

export const getDashboardStats = () => 
  apiClient.get('/dashboard/stats');
