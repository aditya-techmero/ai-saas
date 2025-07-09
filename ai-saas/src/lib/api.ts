import axios from 'axios';
import { LoginCredentials, RegisterData, ContentJobRequest } from '@/types';

// ✅ Use relative API base for Next.js
const api = axios.create({
  baseURL: '/api', // Relative path, no need for NEXT_PUBLIC_API_URL
  timeout: 10000,
});

// ✅ Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Auth API methods (fixed paths)
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/user/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post('/user/register', data);
    return response.data;
  },

  checkHealth: async () => {
    const response = await api.get('/health');
    return response.status === 200;
  },
};

// ✅ Content API methods (fixed paths)
export const contentApi = {
  createJob: async (jobData: ContentJobRequest) => {
    const response = await api.post('/content/create-job', jobData);
    return response.data;
  },

  getMyJobs: async () => {
    const response = await api.get('/content/my-jobs');
    return response.data;
  },
};
