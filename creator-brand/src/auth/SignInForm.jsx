import { useState, useEffect } from 'react';
import { Mail, Lock, UserPlus, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';
import {
  showWelcomeToast, showLoadingToast, showErrorToast, dismissAllToasts
} from '../utils/toastMessages';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [remember, setRemember] = useState(true);
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState('influencer');
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState('auth'); // 'auth' | 'forgot' | 'forgot-sent' | 'reset'
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading, clearError } = useAuthStore();

  useEffect(() => { return () => { dismissAllToasts(); }; }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const loadingToast = showLoadingToast(activeTab === 'login');
    try {
      let result;
      if (activeTab === 'login') {
        result = await login(email, password);
      } else {
        result = await register(name, email, password, userType);
      }
      if (result.success) {
        const { user, isNewUser } = result;
        useNotificationStore.getState().reloadForUser();
        setTimeout(() => {
          dismissAllToasts();
          setTimeout(() => {
            showWelcomeToast(user, isNewUser);
            setTimeout(() => {
              dismissAllToasts();
              setTimeout(() => {
                if (user.userType === 'influencer') navigate('/influencer_dashboard');
                else navigate('/org_dashboard');
              }, 300);
            }, 2000);
          }, 300);
        }, 1000);
      } else {
        setTimeout(() => {
          dismissAllToasts();
          setTimeout(() => showErrorToast(result.error), 300);
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        dismissAllToasts();
        setTimeout(() => showErrorToast(error.message || 'An unexpected error occurred'), 300);
      }, 500);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    clearError();
    dismissAllToasts();
    if (tab === 'login') setName('');
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMsg('');
    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      setForgotMsg(data.message);
      // Dev mode: if token returned, pre-fill reset form
      if (data.dev_token) {
        setResetToken(data.dev_token);
        setTimeout(() => setView('reset'), 1500);
      } else {
        setView('forgot-sent');
      }
    } catch {
      setForgotMsg('Something went wrong. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMsg('');
    try {
      const res = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMsg('Password reset! You can now log in.');
        setTimeout(() => { setView('auth'); setActiveTab('login'); }, 2000);
      } else {
        setForgotMsg(data.message || 'Reset failed.');
      }
    } catch {
      setForgotMsg('Something went wrong.');
    } finally {
      setForgotLoading(false);
    }
  };

  // ── Forgot password view ───────────────────────────────────────────────────
  if (view === 'forgot') return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-5">
        <button onClick={() => setView('auth')} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </button>
        <div>
          <h2 className="text-white text-lg font-semibold mb-1">Reset your password</h2>
          <p className="text-gray-400 text-sm">Enter your email and we'll send you a reset link.</p>
        </div>
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-300">Email address</label>
            <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 focus-within:border-white transition">
              <Mail className="size-4 mr-2 text-gray-400" />
              <input type="email" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-sm"
                placeholder="you@example.com" />
            </div>
          </div>
          {forgotMsg && <p className="text-blue-400 text-xs">{forgotMsg}</p>}
          <button type="submit" disabled={forgotLoading}
            className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2">
            {forgotLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {forgotLoading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  );

  if (view === 'forgot-sent') return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-5 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto text-3xl">📬</div>
        <h2 className="text-white text-lg font-semibold">Check your email</h2>
        <p className="text-gray-400 text-sm leading-relaxed">We sent a password reset link to <span className="text-white">{forgotEmail}</span>. It expires in 1 hour.</p>
        <button onClick={() => setView('auth')} className="text-gray-400 hover:text-white text-sm transition-colors underline underline-offset-2">
          Back to login
        </button>
      </div>
    </div>
  );

  if (view === 'reset') return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-5">
        <h2 className="text-white text-lg font-semibold">Set new password</h2>
        <form onSubmit={handleResetSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-300">Reset token</label>
            <input value={resetToken} onChange={e => setResetToken(e.target.value)} required
              className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-white outline-none"
              placeholder="Paste token from email" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-300">New password</label>
            <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 focus-within:border-white transition">
              <Lock className="size-4 mr-2 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} required value={newPassword}
                onChange={e => setNewPassword(e.target.value)} minLength={6}
                className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-sm"
                placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(p => !p)} className="text-gray-400 hover:text-white ml-2">
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          {forgotMsg && <p className={`text-xs ${forgotMsg.includes('success') || forgotMsg.includes('reset') ? 'text-green-400' : 'text-red-400'}`}>{forgotMsg}</p>}
          <button type="submit" disabled={forgotLoading}
            className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2">
            {forgotLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Reset password
          </button>
        </form>
      </div>
    </div>
  );

  // ── Main auth view ─────────────────────────────────────────────────────────
  const PasswordField = ({ id, value, onChange, placeholder = '••••••••' }) => (
    <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 focus-within:border-white focus-within:ring-2 focus-within:ring-gray-600 transition">
      <Lock className="size-4 mr-2 text-gray-400" />
      <input id={id} type={showPassword ? 'text' : 'password'} required
        className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-sm"
        placeholder={placeholder} value={value} onChange={onChange} />
      <button type="button" onClick={() => setShowPassword(p => !p)}
        className="text-gray-400 hover:text-white ml-2 transition-colors flex-shrink-0">
        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );

  return (
    <div className="w-full h-full relative text-center flex flex-col sm:flex-row overflow-y-auto">
      <div className="relative hidden sm:block sm:w-1/2 text-white flex-shrink-0">
        <img src="src/assets/img/login.png" alt="background"
          className="w-full h-24 sm:h-full object-cover overflow-hidden rounded-t-xl sm:rounded-l-xl sm:rounded-r-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center sm:bg-black/30">
          <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Welcome Back</h3>
          <p className="text-sm sm:text-base text-gray-200 max-w-xs sm:max-w-md px-2">
            Sign in to explore a world of possibilities and seamless experiences.
          </p>
        </div>
      </div>

      <div className="w-full sm:w-1/2 p-5 sm:p-6 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-sm space-y-4">
          <div className="flex border-b border-gray-800">
            {['login', 'register'].map(tab => (
              <button key={tab} type="button" onClick={() => handleTabChange(tab)}
                className={`flex-1 py-1.5 text-center font-medium text-sm transition-colors duration-300 capitalize ${
                  activeTab === tab ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-gray-200'
                }`}>
                {tab === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          {/* Account type selector — shared */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-300 text-start">Account Type</label>
            <select value={userType} onChange={e => setUserType(e.target.value)}
              className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 pr-8 text-white text-sm focus:border-white focus:ring-2 focus:ring-gray-600 transition">
              <option value="influencer">Influencer / Creator</option>
              <option value="brand">Brand / Organization</option>
            </select>
          </div>

          {/* Name field — register only */}
          {activeTab === 'register' && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-300 text-start">
                {userType === 'influencer' ? 'Full Name' : 'Brand Name'}
              </label>
              <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 focus-within:border-white focus-within:ring-2 focus-within:ring-gray-600 transition">
                <UserPlus className="size-4 mr-2 text-gray-400" />
                <input type="text" required
                  className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-sm"
                  placeholder={userType === 'influencer' ? 'John Doe' : 'Brand Name'}
                  value={name} onChange={e => setName(e.target.value)} />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-300 text-start">Email address</label>
            <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 focus-within:border-white focus-within:ring-2 focus-within:ring-gray-600 transition">
              <Mail className="size-4 mr-2 text-gray-400" />
              <input type="email" required
                className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-sm"
                placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-300 text-start">Password</label>
            <PasswordField id="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          {/* Login extras */}
          {activeTab === 'login' && (
            <div className="flex justify-between items-center text-xs text-gray-400">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  className="accent-white w-3.5 h-3.5" />
                Remember me
              </label>
              <button type="button" onClick={() => setView('forgot')}
                className="hover:underline text-white transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          <button type="button" disabled={isLoading} onClick={handleSubmit}
            className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading
              ? (activeTab === 'login' ? 'Signing In...' : 'Creating Account...')
              : (activeTab === 'login' ? 'Sign In' : 'Register')}
          </button>
        </div>
      </div>
    </div>
  );
}