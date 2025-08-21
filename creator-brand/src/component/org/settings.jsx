import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  CreditCard, 
  BarChart3, 
  Globe, 
  Smartphone, 
  Mail,
  ChevronRight
} from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEarnings: false,
    allowMessages: true
  });

  const [twoFactor, setTwoFactor] = useState(false);

  const ToggleSwitch = ({ checked, onChange, label }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const SettingItem = ({ icon: Icon, title, description, action, danger = false }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-800 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${danger ? 'bg-red-950' : 'bg-gray-800'}`}>
          <Icon className={`w-4 h-4 ${danger ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        <div>
          <h4 className={`text-xs font-medium ${danger ? 'text-red-400' : 'text-white'}`}>
            {title}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex items-center">
        {action}
        <ChevronRight className="w-3 h-3 text-gray-600 ml-1" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-white mb-1">Settings</h1>
          <p className="text-xs text-gray-400">Manage your account preferences and settings</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <section className="bg-gray-950 border border-gray-800 rounded-xl px-6 py-5">
            <div className="flex items-center gap-2 mb-5">
              <User className="w-5 h-5 text-gray-400" />
              <h2 className="text-sm font-semibold text-white">Profile</h2>
            </div>
            
            <div className="space-y-1">
              <SettingItem
                icon={User}
                title="Personal Information"
                description="Update your name, bio, and profile picture"
                action={<span className="text-xs text-blue-400">Edit</span>}
              />
              <SettingItem
                icon={Globe}
                title="Public Profile"
                description="Manage your public profile visibility"
                action={<span className="text-xs text-gray-500">Configure</span>}
              />
              <SettingItem
                icon={BarChart3}
                title="Analytics Dashboard"
                description="View detailed performance metrics"
                action={<span className="text-xs text-gray-500">View</span>}
              />
            </div>
          </section>

          {/* Notifications Section */}
          <section className="bg-gray-950 border border-gray-800 rounded-xl px-6 py-5">
            <div className="flex items-center gap-2 mb-5">
              <Bell className="w-5 h-5 text-gray-400" />
              <h2 className="text-sm font-semibold text-white">Notifications</h2>
            </div>
            
            <div className="space-y-3">
              <ToggleSwitch
                checked={notifications.email}
                onChange={(value) => setNotifications(prev => ({ ...prev, email: value }))}
                label="Email notifications"
              />
              <ToggleSwitch
                checked={notifications.push}
                onChange={(value) => setNotifications(prev => ({ ...prev, push: value }))}
                label="Push notifications"
              />
              <ToggleSwitch
                checked={notifications.sms}
                onChange={(value) => setNotifications(prev => ({ ...prev, sms: value }))}
                label="SMS notifications"
              />
              <ToggleSwitch
                checked={notifications.marketing}
                onChange={(value) => setNotifications(prev => ({ ...prev, marketing: value }))}
                label="Marketing emails"
              />
            </div>
          </section>

          {/* Privacy & Security */}
          <section className="bg-gray-950 border border-gray-800 rounded-xl px-6 py-5">
            <div className="flex items-center gap-2 mb-5">
              <Lock className="w-5 h-5 text-gray-400" />
              <h2 className="text-sm font-semibold text-white">Privacy & Security</h2>
            </div>
            
            <div className="space-y-1 mb-6">
              <SettingItem
                icon={Lock}
                title="Change Password"
                description="Update your account password"
                action={<span className="text-xs text-blue-400">Update</span>}
              />
              <SettingItem
                icon={Smartphone}
                title="Two-Factor Authentication"
                description={twoFactor ? "Enabled" : "Add an extra layer of security"}
                action={
                  <button
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`text-xs px-3 py-1 rounded-full ${
                      twoFactor 
                        ? 'bg-green-900 text-green-400' 
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {twoFactor ? 'Enabled' : 'Setup'}
                  </button>
                }
              />
            </div>

            <div className="space-y-3">
              <ToggleSwitch
                checked={privacy.profileVisible}
                onChange={(value) => setPrivacy(prev => ({ ...prev, profileVisible: value }))}
                label="Public profile visibility"
              />
              <ToggleSwitch
                checked={privacy.showEarnings}
                onChange={(value) => setPrivacy(prev => ({ ...prev, showEarnings: value }))}
                label="Show earnings publicly"
              />
              <ToggleSwitch
                checked={privacy.allowMessages}
                onChange={(value) => setPrivacy(prev => ({ ...prev, allowMessages: value }))}
                label="Allow direct messages"
              />
            </div>
          </section>

          {/* Billing Section */}
          <section className="bg-gray-950 border border-gray-800 rounded-xl px-6 py-5">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <h2 className="text-sm font-semibold text-white">Billing & Payments</h2>
            </div>
            
            <div className="space-y-1">
              <SettingItem
                icon={CreditCard}
                title="Payment Methods"
                description="Manage your payment methods"
                action={<span className="text-xs text-gray-500">2 cards</span>}
              />
              <SettingItem
                icon={Mail}
                title="Billing History"
                description="View past invoices and transactions"
                action={<span className="text-xs text-gray-500">View</span>}
              />
              <SettingItem
                icon={BarChart3}
                title="Earnings Report"
                description="Download detailed earnings reports"
                action={<span className="text-xs text-blue-400">Download</span>}
              />
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-gray-950 border border-red-900/30 rounded-xl px-6 py-5">
            <div className="flex items-center gap-2 mb-5">
              <Lock className="w-5 h-5 text-red-400" />
              <h2 className="text-sm font-semibold text-red-400">Danger Zone</h2>
            </div>
            
            <div className="space-y-1">
              <SettingItem
                icon={User}
                title="Deactivate Account"
                description="Temporarily disable your account"
                action={<span className="text-xs text-red-400">Deactivate</span>}
                danger={true}
              />
              <SettingItem
                icon={Lock}
                title="Delete Account"
                description="Permanently delete your account and data"
                action={<span className="text-xs text-red-400">Delete</span>}
                danger={true}
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-xs text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
