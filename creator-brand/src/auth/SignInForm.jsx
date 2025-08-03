import { useState } from 'react';
import { Mail, Lock, UserPlus } from 'lucide-react';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [remember, setRemember] = useState(true);
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState('influencer');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'login') {
      console.log({ email, password, remember, userType, action: 'login' });
    } else {
      console.log({ name, email, password, userType, action: 'register' });
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
          <div className="flex border-b border-neutral-700">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-1.5 text-center font-medium text-sm transition-colors duration-300 ${
                activeTab === 'login' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
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
                    className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:border-white transition"
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
                  <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus-within:border-white transition">
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
                  <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus-within:border-white transition">
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
                  className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition text-sm"
                  onClick={handleSubmit}
                >
                  Sign In
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
                    className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:border-white transition"
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
                  <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus-within:border-white transition">
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
                  <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus-within:border-white transition">
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
                  <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus-within:border-white transition">
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
                  className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition text-sm"
                  onClick={handleSubmit}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}