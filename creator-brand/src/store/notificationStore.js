import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Notification types and their display config
export const NOTIF_TYPES = {
  CAMPAIGN_APPLIED:       { icon: '⚡', color: 'text-blue-400',   label: 'Application sent' },
  CAMPAIGN_ACCEPTED:      { icon: '✓',  color: 'text-green-400',  label: 'Accepted!' },
  CAMPAIGN_REJECTED:      { icon: '✕',  color: 'text-red-400',    label: 'Not selected' },
  MILESTONE_SUBMITTED:    { icon: '📝', color: 'text-amber-400',  label: 'Submission received' },
  MILESTONE_APPROVED:     { icon: '✓',  color: 'text-green-400',  label: 'Milestone approved' },
  MILESTONE_REJECTED:     { icon: '✕',  color: 'text-red-400',    label: 'Revision requested' },
  NEW_MESSAGE:            { icon: '💬', color: 'text-purple-400', label: 'New message' },
  NEW_APPLICANT:          { icon: '👤', color: 'text-blue-400',   label: 'New applicant' },
  CAMPAIGN_CREATED:       { icon: '🚀', color: 'text-white',      label: 'Campaign live' },
  REVIEW_RECEIVED:        { icon: '⭐', color: 'text-amber-400',  label: 'New review' },
};

const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],

      // Add a notification
      push: ({ type, title, body, link = null, campaignId = null, userId = null }) => {
        const notif = {
          id: Date.now() + Math.random(),
          type,
          title,
          body,
          link,
          campaignId,
          userId,
          read: false,
          createdAt: new Date().toISOString(),
        };
        set(s => ({ notifications: [notif, ...s.notifications].slice(0, 50) }));
      },

      // Mark one as read
      markRead: (id) => set(s => ({
        notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
      })),

      // Mark all as read
      markAllRead: () => set(s => ({
        notifications: s.notifications.map(n => ({ ...n, read: true })),
      })),

      // Clear all
      clear: () => set({ notifications: [] }),

      // Computed
      unreadCount: () => get().notifications.filter(n => !n.read).length,
    }),
    {
      name: 'linkfluence-notifications',
      partialize: (s) => ({ notifications: s.notifications }),
    }
  )
);

// ── Helper functions called from anywhere in the app ──────────────────────────

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
    body: `"${milestoneTitle}" was approved by the brand`,
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