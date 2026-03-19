// Re-export auth functions from the central API service
export { login, register, getProfile, updateMyProfile as updateProfile } from './apiService';