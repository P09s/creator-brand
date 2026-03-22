import { create } from 'zustand';

// ── Storage key per user — prevents bleed between accounts ───────────────────
const getStorageKey = () => {
  try {
    const auth = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    const userId = auth?.state?.user?._id;
    return userId ? `liflu-notif-${userId}` : 'liflu-notif-guest';
  } catch {
    return 'liflu-notif-guest';
  }
};

const loadNotifications = () => {
  try {
    const raw = localStorage.getItem(getStorageKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveNotifications = (notifications) => {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(notifications.slice(0, 50)));
  } catch {}
};

// ── Notification types ────────────────────────────────────────────────────────
export const NOTIF_TYPES = {
  CAMPAIGN_APPLIED:    { icon: '⚡', color: 'text-blue-400',   label: 'Application sent'       },
  CAMPAIGN_ACCEPTED:   { icon: '✓',  color: 'text-green-400',  label: 'Accepted!'               },
  CAMPAIGN_REJECTED:   { icon: '✕',  color: 'text-red-400',    label: 'Not selected'            },
  MILESTONE_SUBMITTED: { icon: '📝', color: 'text-amber-400',  label: 'Submission received'     },
  MILESTONE_APPROVED:  { icon: '✓',  color: 'text-green-400',  label: 'Milestone approved'      },
  MILESTONE_REJECTED:  { icon: '✕',  color: 'text-red-400',    label: 'Revision requested'      },
  NEW_MESSAGE:         { icon: '💬', color: 'text-purple-400', label: 'New message'             },
  NEW_APPLICANT:       { icon: '👤', color: 'text-blue-400',   label: 'New applicant'           },
  CAMPAIGN_CREATED:    { icon: '🚀', color: 'text-white',      label: 'Campaign live'           },
  REVIEW_RECEIVED:     { icon: '⭐', color: 'text-amber-400',  label: 'New review'              },
};

const useNotificationStore = create((set, get) => ({
  notifications: loadNotifications(),

  push: ({ type, title, body, link = null }) => {
    const notif = {
      id: Date.now() + Math.random(),
      type,
      title,
      body,
      link,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [notif, ...get().notifications].slice(0, 50);
    saveNotifications(updated);
    set({ notifications: updated });
  },

  markRead: (id) => {
    const updated = get().notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
    set({ notifications: updated });
  },

  markAllRead: () => {
    const updated = get().notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
    set({ notifications: updated });
  },

  clear: () => {
    saveNotifications([]);
    set({ notifications: [] });
  },

  // Re-load from localStorage on user change (called after login)
  reloadForUser: () => {
    set({ notifications: loadNotifications() });
  },

  unreadCount: () => get().notifications.filter(n => !n.read).length,
}));

// ── Helper functions ──────────────────────────────────────────────────────────

export function notifyApplied(campaignTitle) {
  useNotificationStore.getState().push({
    type: 'CAMPAIGN_APPLIED',
    title: 'Application sent',
    body: `You applied to "${campaignTitle}"`,
    link: '/influencer_dashboard/campaigns',
  });
}

export function notifyAccepted(campaignTitle, brandName) {
  useNotificationStore.getState().push({
    type: 'CAMPAIGN_ACCEPTED',
    title: `${brandName} accepted you!`,
    body: `You've been accepted for "${campaignTitle}"`,
    link: '/influencer_dashboard/campaigns',
  });
}

export function notifyRejected(campaignTitle) {
  useNotificationStore.getState().push({
    type: 'CAMPAIGN_REJECTED',
    title: 'Application not selected',
    body: `"${campaignTitle}" went with other creators this time`,
    link: '/influencer_dashboard/campaigns',
  });
}

export function notifyNewApplicant(creatorName, campaignTitle) {
  useNotificationStore.getState().push({
    type: 'NEW_APPLICANT',
    title: 'New applicant',
    body: `${creatorName} applied to "${campaignTitle}"`,
    link: '/org_dashboard/campaigns',
  });
}

export function notifyMilestoneSubmitted(creatorName, milestoneTitle) {
  useNotificationStore.getState().push({
    type: 'MILESTONE_SUBMITTED',
    title: 'Milestone submitted',
    body: `${creatorName} submitted "${milestoneTitle}" for review`,
    link: '/org_dashboard/campaigns',
  });
}

export function notifyMilestoneApproved(milestoneTitle) {
  useNotificationStore.getState().push({
    type: 'MILESTONE_APPROVED',
    title: 'Milestone approved!',
    body: `"${milestoneTitle}" was approved`,
    link: '/influencer_dashboard/campaigns',
  });
}

export function notifyMilestoneRejected(milestoneTitle) {
  useNotificationStore.getState().push({
    type: 'MILESTONE_REJECTED',
    title: 'Revision requested',
    body: `"${milestoneTitle}" needs changes — check the feedback`,
    link: '/influencer_dashboard/campaigns',
  });
}

export function notifyNewMessage(senderName, preview, link) {
  useNotificationStore.getState().push({
    type: 'NEW_MESSAGE',
    title: `Message from ${senderName}`,
    body: preview.length > 60 ? preview.slice(0, 60) + '…' : preview,
    link,
  });
}

export function notifyCampaignCreated(campaignTitle) {
  useNotificationStore.getState().push({
    type: 'CAMPAIGN_CREATED',
    title: 'Campaign is live',
    body: `"${campaignTitle}" is now visible to creators`,
    link: '/org_dashboard/campaigns',
  });
}

export function notifyReviewReceived(reviewerName, rating) {
  useNotificationStore.getState().push({
    type: 'REVIEW_RECEIVED',
    title: `${rating}★ review received`,
    body: `${reviewerName} left you a review`,
    link: null,
  });
}

export default useNotificationStore;