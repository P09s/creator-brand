import { useState, useEffect } from 'react';
import { Mail, Lock, UserPlus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { 
  showWelcomeToast, 
  showLoadingToast, 
  showErrorToast, 
  dismissAllToasts 
} from '../utils/toastMessages';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [remember, setRemember] = useState(true);
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState('influencer');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading, clearError } = useAuthStore();

  // Dismiss toasts when component unmounts or navigates away
  useEffect(() => {
    return () => {
      dismissAllToasts();
    };
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    // Show loading toast
    const loadingToast = showLoadingToast(activeTab === 'login');
    
    try {
      let result;
      if (activeTab === "login") {
        result = await login(email, password);
      } else {
        result = await register(name, email, password, userType);
      }

      if (result.success) {
        const { user, isNewUser } = result;
        console.log("User Profile:", user);
        
        // Wait a bit to let user see the loading toast, then transition smoothly
        setTimeout(() => {
          // Dismiss loading toast first
          dismissAllToasts();
          
          // Wait a moment for the dismissal animation, then show welcome toast
          setTimeout(() => {
            const welcomeToast = showWelcomeToast(user, isNewUser);
            
            // Navigate after showing welcome message for adequate time
            setTimeout(() => {
              // Dismiss the welcome toast before navigation for smooth transition
              dismissAllToasts();
              
              // Wait for dismissal animation before navigating
              setTimeout(() => {
                if (user.userType === "influencer") {
                  navigate("/influencer_dashboard");
                } else if (user.userType === "brand") {
                  navigate("/org_dashboard");
                }
              }, 300); // Wait for toast dismissal animation
              
            }, 2000); // Show welcome message for 3 seconds
            
          }, 300); // Wait for loading toast to fully dismiss
          
        }, 1000); // Show loading toast for at least 1 second

      } else {
        // For errors, wait a bit then dismiss loading and show error
        setTimeout(() => {
          dismissAllToasts();
          setTimeout(() => {
            showErrorToast(result.error);
          }, 300);
        }, 500);
      }
    } catch (error) {
      // For catch errors, same pattern
      setTimeout(() => {
        dismissAllToasts();
        setTimeout(() => {
          console.error("Auth Error:", error);
          showErrorToast(error.message || 'An unexpected error occurred');
        }, 300);
      }, 500);
    }
  };

  // Clear form when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    clearError();
    dismissAllToasts(); // Clear any existing toasts
    
    // Reset form fields when switching tabs
    if (tab === 'login') {
      setName('');
    } else {
      // Keep email if switching from login to register
    }
  };

  return (
    <div className="w-full h-full relative text-center overflow-hidden flex flex-col sm:flex-row overflow-y-auto">
      <div className="relative w-full sm:w-1/2 text-white">
        <img
          src="src/assets/img/login.png"
          alt="background"
          className="w-full h-24 sm:h-full object-cover overflow-hidden rounded-t-xl sm:rounded-l-xl sm:rounded-r-none"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center sm:bg-black/30">
          <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Welcome Back</h3>
          <p className="text-sm sm:text-base text-gray-200 max-w-xs sm:max-w-md px-2">
            Sign in to explore a world of possibilities and seamless experiences.
          </p>
        </div>
      </div>

      <div className="w-full sm:w-1/2 p-4 sm:p-6 flex items-center justify-center sm:ml-0 pb-20 sm:pb-24">
        <div className="w-full max-w-sm sm:max-w-md space-y-5">
          <div className="flex border-b border-gray-800">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-1.5 text-center font-medium text-sm transition-colors duration-300 ${
                activeTab === 'login' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-1.5 text-center font-medium text-sm transition-colors duration-300 ${
                activeTab === 'register' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Register
            </button>
          </div>

          <div
            className="transition-all duration-300 ease-in-out transform"
            style={{
              opacity: activeTab === 'login' ? 1 : 0,
              transform: activeTab === 'login' ? 'translateX(0)' : 'translateX(20px)',
            }}
            key="login"
          >
            {activeTab === 'login' && (
              <div className="space-y-4">
                <h2 className="text-white text-base sm:text-lg font-medium text-center">Sign In</h2>
                <div className="flex flex-col gap-2">
                  <label htmlFor="userType" className="text-xs font-medium text-gray-300 text-start">
                    Account Type
                  </label>
                  <select
                    id="userType"
                    className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 pr-8 text-white text-sm focus:border-white focus:ring-2 focus:ring-gray-600 transition"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <option value="influencer">Influencer</option>
                    <option value="brand">Brand</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-medium text-gray-300 text-start">
                    Email address
                  </label>
                  <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 focus-within:border-white focus-within:ring-2 focus-within:ring-gray-600 transition">
                    <Mail className="size-4 mr-2 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-sm"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-xs font-medium text-gray-300 text-start">
                    Password
                  </label>
                  <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 focus-within:border-white focus-within:ring-2 focus-within:ring-gray-600 transition">
                    <Lock className="size-4 mr-2 text-gray-400" />
                    <input
                      id="password"
                      type="password"
                      required
                      className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-sm"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-400">
                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="accent-white w-3.5 h-3.5"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="hover:underline text-white"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isLoading}
                  className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            )}
          </div>
          
          <div
            className="transition-all duration-300 ease-in-out transform"
            style={{
              opacity: activeTab === 'register' ? 1 : 0,
              transform: activeTab === 'register' ? 'translateX(0)' : 'translateX(-20px)',
            }}
            key="register"
          >
            {activeTab === 'register' && (
              <div className="space-y-4">
                <h2 className="text-white text-base sm:text-lg font-medium text-center">Create Account</h2>
                <div className="flex flex-col gap-2">
                  <label htmlFor="userType" className="text-xs font-medium text-gray-300 text-start">
                    Account Type
                  </label>
                  <select
                    id="userType"
                    className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 pr-8 text-white text-sm focus:border-white focus:ring-2 focus:ring-gray-600 transition"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <option value="influencer">Influencer</option>
                    <option value="brand">Brand</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-medium text-gray-300 text-start">
                    {userType === 'influencer' ? 'Full Name' : 'Brand Name'}
                  </label>
                  <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 focus-within:border-white focus-within:ring-2 focus-within:ring-gray-600 transition">
                    <UserPlus className="size-4 mr-2 text-gray-400" />
                    <input
                      id="name"
                      type="text"
                      required
                      className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-sm"
                      placeholder={userType === 'influencer' ? 'John Doe' : 'Brand Name'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-medium text-gray-300 text-start">
                    Email address
                  </label>
                  <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 focus-within:border-white focus-within:ring-2 focus-within:ring-gray-600 transition">
                    <Mail className="size-4 mr-2 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-sm"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-xs font-medium text-gray-300 text-start">
                    Password
                  </label>
                  <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 focus-within:border-white focus-within:ring-2 focus-within:ring-gray-600 transition">
                    <Lock className="size-4 mr-2 text-gray-400" />
                    <input
                      id="password"
                      type="password"
                      required
                      className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-sm"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isLoading}
                  className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                >
                  {isLoading ? 'Creating Account...' : 'Register'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}