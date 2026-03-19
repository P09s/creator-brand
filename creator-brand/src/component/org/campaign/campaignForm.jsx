import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Users, Target, DollarSign, Calendar, Image, FileText, Check, Loader2 } from 'lucide-react';
import { useCampaigns } from '../../../hooks/useCampaigns';
import toast from 'react-hot-toast';
import { notifyCampaignCreated } from '../../../store/notificationStore';
import useAuthStore from '../../../store/authStore';

const PLATFORMS = ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn', 'Multiple'];
const CATEGORIES = ['Technology', 'Fashion', 'Fitness', 'Food', 'Travel', 'Beauty', 'Gaming', 'Education', 'Lifestyle', 'Business'];

function CampaignForm({ prefillData, onSuccess }) {
  const { create } = useCampaigns();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: 'Instagram',
    category: 'Technology',
    budget: '',
    deadline: '',
    requirements: '',
    targetAudience: '',
    brandName: '',
  });
  const [errors, setErrors] = useState({});

  // Auto-fill from AI brief if provided
  useEffect(() => {
    if (prefillData) {
      setFormData(prev => ({
        ...prev,
        title: prefillData.title || '',
        description: prefillData.description || '',
        requirements: prefillData.requirements || '',
        targetAudience: prefillData.targetAudience || '',
      }));
    }
  }, [prefillData]);

  const update = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = () => {
    const e = {};
    if (currentStep === 0) {
      if (!formData.title.trim()) e.title = 'Title is required';
      if (!formData.description.trim()) e.description = 'Description is required';
      if (!formData.brandName.trim()) e.brandName = 'Brand name is required';
    }
    if (currentStep === 1) {
      if (!formData.budget || isNaN(formData.budget) || Number(formData.budget) <= 0) e.budget = 'Valid budget required';
      if (!formData.deadline) e.deadline = 'Deadline is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setCurrentStep(s => s + 1); };
  const prev = () => { setCurrentStep(s => s - 1); setErrors({}); };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    const result = await create({
      ...formData,
      budget: Number(formData.budget),
      brandName: formData.brandName || user?.name,
    });
    setSubmitting(false);
    if (result.success) {
      notifyCampaignCreated(formData.title);
      toast.success('Campaign created!');
      onSuccess?.();
    } else {
      toast.error(result.error || 'Failed to create campaign');
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-black border ${errors[field] ? 'border-red-500' : 'border-gray-800'} rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors`;

  const steps = [
    {
      title: 'Campaign basics',
      icon: <FileText className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          {prefillData && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-xs text-purple-300 flex items-center gap-2">
              ✦ Pre-filled from your AI-generated brief — edit as needed
            </div>
          )}
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Campaign Title *</label>
            <input value={formData.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Summer Launch 2025" className={inputClass('title')} />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Brand Name *</label>
            <input value={formData.brandName} onChange={e => update('brandName', e.target.value)} placeholder="Your brand name" className={inputClass('brandName')} />
            {errors.brandName && <p className="text-red-400 text-xs mt-1">{errors.brandName}</p>}
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Description *</label>
            <textarea value={formData.description} onChange={e => update('description', e.target.value)} placeholder="What's this campaign about?" rows={4} className={`${inputClass('description')} resize-none`} />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Platform</label>
              <select value={formData.platform} onChange={e => update('platform', e.target.value)} className={inputClass('platform')}>
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Category</label>
              <select value={formData.category} onChange={e => update('category', e.target.value)} className={inputClass('category')}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Budget & timeline',
      icon: <DollarSign className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Budget (USD) *</label>
            <input type="number" value={formData.budget} onChange={e => update('budget', e.target.value)} placeholder="2500" className={inputClass('budget')} />
            {errors.budget && <p className="text-red-400 text-xs mt-1">{errors.budget}</p>}
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Deadline *</label>
            <input type="date" value={formData.deadline} onChange={e => update('deadline', e.target.value)} min={new Date().toISOString().split('T')[0]} className={inputClass('deadline')} />
            {errors.deadline && <p className="text-red-400 text-xs mt-1">{errors.deadline}</p>}
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Target Audience</label>
            <input value={formData.targetAudience} onChange={e => update('targetAudience', e.target.value)} placeholder="e.g. Fitness enthusiasts 18-35" className={inputClass('targetAudience')} />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Requirements / Deliverables</label>
            <textarea value={formData.requirements} onChange={e => update('requirements', e.target.value)} placeholder="What do you expect from creators? (posts, stories, videos...)" rows={4} className={`${inputClass('requirements')} resize-none`} />
          </div>
        </div>
      ),
    },
    {
      title: 'Review & launch',
      icon: <Check className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div className="bg-black border border-gray-800 rounded-xl p-5 space-y-3">
            {[
              ['Title', formData.title],
              ['Brand', formData.brandName],
              ['Platform', formData.platform],
              ['Category', formData.category],
              ['Budget', formData.budget ? `$${Number(formData.budget).toLocaleString()}` : '—'],
              ['Deadline', formData.deadline ? new Date(formData.deadline).toLocaleDateString() : '—'],
              ['Target Audience', formData.targetAudience || '—'],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-start text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="text-white text-right max-w-xs">{val || '—'}</span>
              </div>
            ))}
          </div>
          {formData.description && (
            <div className="bg-black border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">Description</p>
              <p className="text-gray-300 text-sm">{formData.description}</p>
            </div>
          )}
        </div>
      ),
    },
  ];

  const totalSteps = steps.length;

  return (
    <div className="w-full max-w-2xl mx-auto h-full flex flex-col">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-white">Create Campaign</h2>
          <span className="text-xs text-gray-500">{currentStep + 1} / {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1">
          <div className="bg-white h-1 rounded-full transition-all duration-500" style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }} />
        </div>
        <div className="flex justify-between mt-3">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center justify-center w-8 h-8 rounded-full text-xs transition-all ${i <= currentStep ? 'bg-white text-black' : 'bg-gray-900 border border-gray-700 text-gray-500'}`}>
              {s.icon}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="mb-4">
          <h3 className="text-white font-medium">{steps[currentStep].title}</h3>
        </div>
        {steps[currentStep].content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-5 border-t border-gray-800 mt-5">
        <button onClick={prev} disabled={currentStep === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-gray-800 text-gray-300 hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        {currentStep < totalSteps - 1 ? (
          <button onClick={next}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold bg-white text-black hover:bg-gray-100 transition-colors">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-white text-black hover:bg-gray-100 disabled:opacity-50 transition-colors">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {submitting ? 'Launching...' : 'Launch Campaign'}
          </button>
        )}
      </div>
    </div>
  );
}

export default CampaignForm;