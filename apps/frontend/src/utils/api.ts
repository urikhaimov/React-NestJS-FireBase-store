// src/utils/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // Backend NestJS server
  withCredentials: true, // Needed if you're using cookies (auth)
});
