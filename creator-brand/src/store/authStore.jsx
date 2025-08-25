import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginAPI, register as registerAPI, getProfile as getProfileAPI } from '../services/authService';

// Helper function to parse error messages
const parseErrorMessage = (errorMessage) => {
  if (typeof errorMessage === 'string') {
    try {
      const parsed = JSON.parse(errorMessage);
      return parsed.message || errorMessage;
    } catch {
      return errorMessage;
    }
  }
  return errorMessage?.message || 'Something went wrong';
};

// Helper function to get user-friendly error messages
const getUserFriendlyError = (error) => {
  const message = parseErrorMessage(error);
  
  const errorMap = {
    'Invalid credentials': 'Email or password is incorrect. Please try again.',
    'User already exists': 'An account with this email already exists. Try logging in instead.',
    'User not found': 'No account found with this email address.',
    'Server error': 'We\'re experiencing technical difficulties. Please try again in a moment.',
    'Network request failed': 'Please check your internet connection and try again.',
    'Token is not valid': 'Your session has expired. Please log in again.',
  };

  return errorMap[message] || message || 'An unexpected error occurred. Please try again.';
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isNewUser: false, // Add this to track if user just registered

      // Actions
      login: async (email, password) => {
        set({ isLoading: true, error: null, isNewUser: false });
        try {
          const result = await loginAPI(email, password);
          const profile = await getProfileAPI(result.token);
          
          set({
            token: result.token,
            user: profile,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            isNewUser: false // Existing user logging in
          });
          
          return { success: true, user: profile, isNewUser: false };
        } catch (error) {
          const friendlyError = getUserFriendlyError(error.message);
          set({ 
            isLoading: false, 
            error: friendlyError,
            isAuthenticated: false,
            user: null,
            token: null,
            isNewUser: false
          });
          return { success: false, error: friendlyError };
        }
      },

      register: async (name, email, password, userType) => {
        set({ isLoading: true, error: null, isNewUser: false });
        try {
          const result = await registerAPI(name, email, password, userType);
          const profile = await getProfileAPI(result.token);
          
          set({
            token: result.token,
            user: profile,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            isNewUser: true // New user registering
          });
          
          return { success: true, user: profile, isNewUser: true };
        } catch (error) {
          const friendlyError = getUserFriendlyError(error.message);
          set({ 
            isLoading: false, 
            error: friendlyError,
            isAuthenticated: false,
            user: null,
            token: null,
            isNewUser: false
          });
          return { success: false, error: friendlyError };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          isNewUser: false
        });
      },

      clearError: () => {
        set({ error: null });
      },

      initializeAuth: async () => {
        const { token } = get();
        if (token) {
          try {
            const profile = await getProfileAPI(token);
            set({
              user: profile,
              isAuthenticated: true
            });
          } catch (error) {
            set({
              user: null,
              token: null,
              isAuthenticated: false
            });
          }
        }
      },

      updateUser: (userData) => {
        set(state => ({
          user: { ...state.user, ...userData }
        }));
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export default useAuthStore;