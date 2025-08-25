import toast from 'react-hot-toast';

// Custom toast styles
const toastStyles = {
  success: {
    style: {
      background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
      color: '#ffffff',
      border: '1px solid #10b981',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      padding: '16px 20px',
      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)',
      maxWidth: '400px',
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#ffffff',
    },
    duration: 2000,
  },
  error: {
    style: {
      background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
      color: '#ffffff',
      border: '1px solid #ef4444',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      padding: '16px 20px',
      boxShadow: '0 10px 25px rgba(239, 68, 68, 0.2)',
      maxWidth: '400px',
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#ffffff',
    },
    duration: 4000, // Longer duration for errors
  },
  loading: {
    style: {
      background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
      color: '#ffffff',
      border: '1px solid #6b7280',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      padding: '16px 20px',
      maxWidth: '400px',
    },
  }
};

export const showWelcomeToast = (user, isNewUser = false) => {
  const message = isNewUser 
    ? `Welcome to LinkFluence, ${user.name}! 🎉`
    : `Welcome back, ${user.name}! 👋`;
  
  const emoji = isNewUser ? '🚀' : '✨';
  
  return toast.success(message, {
    ...toastStyles.success,
    icon: emoji,
    duration: 2000,
    // Ensure this toast appears alone
    id: 'welcome-toast',
  });
};

export const showLoadingToast = (isLogin = true) => {
  const message = isLogin ? 'Signing you in...' : 'Creating your account...';
  
  return toast.loading(message, {
    ...toastStyles.loading,
    // Unique ID to prevent duplicates
    id: 'auth-loading',
  });
};

export const showErrorToast = (message) => {
  return toast.error(message, {
    ...toastStyles.error,
    // Unique ID for error toasts
    id: 'auth-error',
  });
};

export const showSuccessToast = (message) => {
  return toast.success(message, {
    ...toastStyles.success,
    duration: 2000,
  });
};

// Function to dismiss specific toast
export const dismissLoadingToast = () => {
  toast.dismiss('auth-loading');
};

export const dismissWelcomeToast = () => {
  toast.dismiss('welcome-toast');
};

export const dismissErrorToast = () => {
  toast.dismiss('auth-error');
};

// Function to dismiss all toasts with animation
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Sequential toast function to ensure proper timing
export const showSequentialToasts = async (user, isNewUser) => {
  return new Promise((resolve) => {
    // First dismiss any existing toasts
    dismissAllToasts();
    
    // Wait for dismissal animation
    setTimeout(() => {
      // Show welcome toast
      const welcomeToast = showWelcomeToast(user, isNewUser);
      
      // Resolve after welcome toast duration
      setTimeout(() => {
        dismissWelcomeToast();
        setTimeout(() => {
          resolve();
        }, 400); // Wait for dismissal animation
      }, 2000); // Show welcome for 2 seconds
      
    }, 400); // Wait for previous toasts to dismiss
  });
};