import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  BarChart3, 
  MessageCircle, 
  CreditCard, 
  Settings,
  Download,
  Bell,
  TrendingUp,
  Zap
} from 'lucide-react';

// SideBar Component
function SideBar() {
  const [activeItem, setActiveItem] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
    { id: 'influencers', label: 'Influencers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="w-72 h-full transition duration-300 ease-in-out bg-black backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col relative z-10 shadow-xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-black">
            <img className="w-8 h-8" src="src/assets/img/logo.png" alt="logo" />
          </div>
          <div>
            <h1 className="text-xl text-white font-boldtext-white font-satoshi tracking-tight">LinkFluence</h1>
            <p className="text-xs text-white font-medium">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  activeItem === item.id
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-neutral-900'
                }`}
              >
                <IconComponent className="mr-3 w-5 h-5" />
                <span className="font-satoshi">{item.label}</span>
                {item.id === 'messages' && (
                  <span className="ml-auto w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-900 transition-all duration-200 cursor-pointer group">
          <div className="relative">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI39jmnqGugnR-LKaHU6za8QqCi9JO541veg&s" 
              alt="user_logo" 
              className="w-10 h-10 rounded-full ring-2 ring-blue-500 object-cover" 
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate font-satoshi group-hover:text-slate-900 dark:group-hover:text-slate-100">
              Tillu Badmaas
            </p>
            <p className="text-xs text-white truncate font-satoshi">
              Brand Manager
            </p>
          </div>
          <div className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-200">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar