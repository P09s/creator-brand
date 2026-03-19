import { useState, useEffect, useCallback } from 'react';
import { getCampaigns, getMyCampaigns, applyToCampaign, createCampaign, deleteCampaign } from '../services/apiService';
import useAuthStore from '../store/authStore';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  const isBrand = user?.userType === 'brand';

  const fetchCampaigns = useCallback(async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const data = isBrand ? await getMyCampaigns() : await getCampaigns(filters);
      setCampaigns(data);
    } catch {
      setError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  }, [isBrand]);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const apply = async (campaignId) => {
    try {
      await applyToCampaign(campaignId);
      setCampaigns(prev => prev.map(c =>
        c._id === campaignId
          ? { ...c, applicants: [...(c.applicants || []), user._id] }
          : c
      ));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const create = async (data) => {
    try {
      const newCampaign = await createCampaign(data);
      // Add immediately to state so it shows up without a page refresh
      setCampaigns(prev => [newCampaign, ...prev]);
      return { success: true, campaign: newCampaign };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const remove = async (id) => {
    try {
      await deleteCampaign(id);
      setCampaigns(prev => prev.filter(c => c._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const hasApplied = (campaignId) =>
    campaigns.find(c => c._id === campaignId)?.applicants?.includes(user?._id);

  return { campaigns, loading, error, apply, create, remove, hasApplied, refetch: fetchCampaigns };
}

export function useBrowseCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const data = await getCampaigns(filters);
      setCampaigns(data);
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { search(); }, [search]);

  return { campaigns, loading, search };
}