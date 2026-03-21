import React, { useState, useEffect } from 'react';
import {
  User, Bell, Lock, Shield, Trash2, ChevronRight,
  Eye, EyeOff, Loader2, CheckCircle, AlertCircle, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { changePassword, updateDisplayName } from '../../services/apiService';
import useAuthStore from '../../store/authStore';
import Avatar from './Avatar';
import useNotificationStore from '../../store/notificationStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
        checked ? 'bg-white' : 'bg-gray-700'
      }`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-black transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-1'
      }`} />
    </button>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ icon: Icon, title, children }) {
  return (
    <section className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-800">
        <Icon className="w-4 h-4 text-gray-400" />
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      <div className="px-5 py-4 space-y-4">{children}</div>
    </section>
  );
}

// ── Toggle row ────────────────────────────────────────────────────────────────
function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm">{label}</p>
        {description && <p className="text-gray-500 text-xs mt-0.5">{description}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ── Password change panel ─────────────────────────────────────────────────────
function PasswordPanel() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState({ current: false, next: false });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.current) e.current = 'Required';
    if (form.next.length < 6) e.next = 'At least 6 characters';
    if (form.next !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await changePassword(form.current, form.next);
      toast.success('Password changed successfully');
      setForm({ current: '', next: '', confirm: '' });
      setOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const PasswordField = ({ field, label, showKey }) => (
    <div>
      <label className="text-gray-500 text-xs mb-1.5 block">{label}</label>
      <div className="relative">
        <input
          type={show[showKey] ? 'text' : 'password'}
          value={form[field]}
          onChange={e => { setForm(p => ({ ...p, [field]: e.target.value })); setErrors(p => ({ ...p, [field]: '' })); }}
          className={`w-full bg-black border rounded-xl px-4 py-2.5 text-white text-sm pr-10 focus:outline-none transition-colors ${
            errors[field] ? 'border-red-500' : 'border-gray-800 focus:border-gray-600'
          }`}
        />
        {showKey && (
          <button type="button" onClick={() => setShow(p => ({ ...p, [showKey]: !p[showKey] }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
            {show[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-900/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <Lock className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-white text-sm">Change password</p>
            <p className="text-gray-500 text-xs">Update your account password</p>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden border-t border-gray-800">
            <div className="p-4 space-y-3 bg-black/30">
              <PasswordField field="current" label="Current password" showKey="current" />
              <PasswordField field="next" label="New password" showKey="next" />
              <PasswordField field="confirm" label="Confirm new password" />
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 bg-white hover:bg-gray-100 disabled:opacity-50 text-black px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Update password'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Name change panel ─────────────────────────────────────────────────────────
function NamePanel() {
  const { user, updateUser } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || name.trim() === user?.name) { setOpen(false); return; }
    setSaving(true);
    try {
      await updateDisplayName(name.trim());
      updateUser({ name: name.trim() });
      toast.success('Name updated');
      setOpen(false);
    } catch { toast.error('Failed to update name'); }
    finally { setSaving(false); }
  };

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-900/50 transition-colors text-left">
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-white text-sm">Display name</p>
            <p className="text-gray-500 text-xs">{user?.name}</p>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden border-t border-gray-800">
            <div className="p-4 flex gap-3 bg-black/30">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your display name"
                className="flex-1 bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gray-600" />
              <button onClick={handleSave} disabled={saving || !name.trim()}
                className="bg-white hover:bg-gray-100 disabled:opacity-50 text-black px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Settings component ───────────────────────────────────────────────────
export default function Settings() {
  const { user, logout } = useAuthStore();
  const { clear: clearNotifications } = useNotificationStore();
  const navigate = useNavigate();

  // Notification prefs stored in localStorage — email/SMS needs external services later
  const NOTIF_KEY = `notif_prefs_${user?._id}`;
  const saved = JSON.parse(localStorage.getItem(NOTIF_KEY) || '{}');

  const [notif, setNotif] = useState({
    newCampaignMatch: saved.newCampaignMatch ?? true,
    applicationUpdate: saved.applicationUpdate ?? true,
    milestoneAlert: saved.milestoneAlert ?? true,
    newMessage: saved.newMessage ?? true,
    platformUpdates: saved.platformUpdates ?? false,
  });

  // Privacy prefs stored locally too
  const PRIV_KEY = `priv_prefs_${user?._id}`;
  const savedPriv = JSON.parse(localStorage.getItem(PRIV_KEY) || '{}');
  const [privacy, setPrivacy] = useState({
    profileVisible: savedPriv.profileVisible ?? true,
    allowMessages: savedPriv.allowMessages ?? true,
    showEarnings: savedPriv.showEarnings ?? false,
  });

  const updateNotif = (key, val) => {
    const updated = { ...notif, [key]: val };
    setNotif(updated);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
    toast.success('Preference saved');
  };

  const updatePrivacy = (key, val) => {
    const updated = { ...privacy, [key]: val };
    setPrivacy(updated);
    localStorage.setItem(PRIV_KEY, JSON.stringify(updated));
    toast.success('Preference saved');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleClearNotifications = () => {
    clearNotifications();
    toast.success('Notifications cleared');
  };

  const isInfluencer = user?.userType === 'influencer';

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 text-xs mt-1">Manage your account and preferences</p>
      </div>

      {/* Account info */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <Avatar src={user?.avatar} name={user?.name} size="lg" />
          <div>
            <p className="text-white font-semibold">{user?.name}</p>
            <p className="text-gray-500 text-xs">{user?.email} · {user?.userName}</p>
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
              {user?.userType === 'brand' ? 'Organization' : 'Creator'}
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-600 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
          Email address cannot be changed. Contact support if you need to update it.
        </div>
      </div>

      {/* Account */}
      <Section icon={User} title="Account">
        <NamePanel />
        <PasswordPanel />
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications">
        <p className="text-gray-600 text-xs -mt-1 pb-2 border-b border-gray-800">
          Controls which in-app notifications appear. Email notifications coming in a future update.
        </p>
        <ToggleRow
          label={isInfluencer ? 'New campaign matches' : 'New applicants'}
          description={isInfluencer ? 'When a campaign matches your niche' : 'When a creator applies to your campaign'}
          checked={notif.newCampaignMatch}
          onChange={v => updateNotif('newCampaignMatch', v)}
        />
        <ToggleRow
          label="Application updates"
          description={isInfluencer ? 'Accepted or rejected from campaigns' : 'Campaign status changes'}
          checked={notif.applicationUpdate}
          onChange={v => updateNotif('applicationUpdate', v)}
        />
        <ToggleRow
          label="Milestone alerts"
          description="Submissions, approvals, and rejections"
          checked={notif.milestoneAlert}
          onChange={v => updateNotif('milestoneAlert', v)}
        />
        <ToggleRow
          label="New messages"
          description="When someone sends you a message"
          checked={notif.newMessage}
          onChange={v => updateNotif('newMessage', v)}
        />
        <ToggleRow
          label="Platform updates"
          description="New features and announcements"
          checked={notif.platformUpdates}
          onChange={v => updateNotif('platformUpdates', v)}
        />
        <button onClick={handleClearNotifications}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors underline underline-offset-2">
          Clear all notifications
        </button>
      </Section>

      {/* Privacy */}
      <Section icon={Shield} title="Privacy">
        <ToggleRow
          label="Public profile"
          description={`Your profile is ${privacy.profileVisible ? 'visible' : 'hidden'} to ${isInfluencer ? 'brands' : 'creators'}`}
          checked={privacy.profileVisible}
          onChange={v => updatePrivacy('profileVisible', v)}
        />
        <ToggleRow
          label="Allow messages"
          description={`${isInfluencer ? 'Brands' : 'Creators'} can message you directly`}
          checked={privacy.allowMessages}
          onChange={v => updatePrivacy('allowMessages', v)}
        />
        <ToggleRow
          label={isInfluencer ? 'Show earnings' : 'Show spend'}
          description="Display on your public profile"
          checked={privacy.showEarnings}
          onChange={v => updatePrivacy('showEarnings', v)}
        />
      </Section>

      {/* Danger zone */}
      <Section icon={AlertCircle} title="Account actions">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 bg-black border border-gray-800 hover:border-gray-600 rounded-xl transition-colors text-left group"
        >
          <LogOut className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          <div>
            <p className="text-white text-sm">Sign out</p>
            <p className="text-gray-500 text-xs">Sign out of your account on this device</p>
          </div>
        </button>
        <div className="border border-red-900/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Trash2 className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Delete account</p>
              <p className="text-gray-500 text-xs mt-0.5 mb-3">Permanently delete your account and all data. This cannot be undone.</p>
              <button className="text-xs text-red-400 border border-red-900/50 hover:border-red-500/50 hover:bg-red-500/5 px-3 py-1.5 rounded-lg transition-colors">
                Request deletion
              </button>
            </div>
          </div>
        </div>
      </Section>

      <p className="text-gray-700 text-xs text-center">LinkFluence · Built by CyberPunks</p>
    </div>
  );
}