import { useState } from 'react';
import { Mail, Lock, UserPlus } from 'lucide-react';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For registration
  const [remember, setRemember] = useState(true);
  const [activeTab, setActiveTab] = useState('login');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'login') {
      console.log({ email, password, remember, action: 'login' });
      // Add login authentication logic here
    } else {
      console.log({ name, email, password, action: 'register' });
      // Add registration authentication logic here
    }
  };

  return (
    <div className="w-full h-full flex">
      {/* Visual/Brand Side (Inspired by Dropbox/Airbnb) */}
      <div className="w-1/2 bg-gradient-to-br from-gray-800 to-neutral-900 p-6 flex items-center justify-center text-white">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Welcome Back</h3>
          <p className="text-sm text-gray-300">
            Sign in to explore a world of possibilities and seamless experiences.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-1/2 bg-neutral-900 p-6 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-neutral-700">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 text-center font-medium text-sm transition-colors duration-300 ${
                activeTab === 'login' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 text-center font-medium text-sm transition-colors duration-300 ${
                activeTab === 'register' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Content */}
          {activeTab === 'login' ? (
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-center">Sign In</h2>
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-medium text-gray-300">
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

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-medium text-gray-300">
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

              {/* Remember + Forgot */}
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

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition text-sm"
                onClick={handleSubmit}
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-center">Create Account</h2>
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-medium text-gray-300">
                  Full Name
                </label>
                <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus-within:border-white transition">
                  <UserPlus className="size-4 mr-2 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    required
                    className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-sm"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-medium text-gray-300">
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

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-medium text-gray-300">
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

              {/* Register Button */}
              <button
                type="submit"
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
  );
}