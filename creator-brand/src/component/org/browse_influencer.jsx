import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Browse_influencer = () => {
  const [selectedNiche, setSelectedNiche] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);

  const niches = ['All', 'Fashion', 'Fitness', 'Tech', 'Food', 'Travel'];

  const organizations = [
    {
      name: 'Glow Cosmetics',
      niche: 'Fashion',
      description: 'A premium skincare and beauty brand looking for influencers to promote their latest product line.',
      logo: '/logo.png',
    },
    {
      name: 'FitLife Gear',
      niche: 'Fitness',
      description: 'Sportswear and accessories brand collaborating with fitness influencers for campaigns.',
      logo: '/logo.png',
    },
    {
      name: 'Techify',
      niche: 'Tech',
      description: 'Innovative gadgets brand seeking influencers to showcase their new smart devices.',
      logo: '/logo.png',
    },
    {
      name: 'TasteBud',
      niche: 'Food',
      description: 'Restaurant chain offering partnerships with food bloggers and content creators.',
      logo: '/logo.png',
    },
    {
      name: 'WanderWorld',
      niche: 'Travel',
      description: 'Travel agency working with influencers to share unique travel experiences.',
      logo: '/logo.png',
    },
  ];

  const filteredOrgs = selectedNiche === 'All' ? organizations : organizations.filter(org => org.niche === selectedNiche);

  const handleReachOut = (org) => {
    setSelectedOrg(org);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans text-sm leading-relaxed">
      <div className="max-w-7xl mx-auto px-10 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Organizations</h1>
            <p className="text-gray-500 text-xs">Find brands that align with your interests and niche</p>
          </div>

          <div className="relative w-full md:w-64">
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="appearance-none w-full bg-black border border-gray-700 rounded pl-4 pr-8 py-2 text-xs text-white cursor-pointer"
            >
              {niches.map((niche, index) => (
                <option key={index} value={niche}>{niche}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none pl-1" />
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOrgs.map((org, index) => (
            <div
              key={index}
              className="bg-gray-950 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <img src={org.logo} alt={org.name} className="w-10 h-10 rounded-full border border-gray-700" />
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <img src="/logo.png" alt="icon" className="w-4 h-4" />
                    {org.name}
                  </div>
                  <div className="text-xs text-gray-500">{org.niche}</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-6 flex-1">{org.description}</p>
              <button
                onClick={() => handleReachOut(org)}
                className="mt-auto px-4 py-2 text-xs bg-gray-900 border border-gray-700 rounded hover:border-gray-500 transition"
              >
                Show Interest
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && selectedOrg && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-8 w-full max-w-lg relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-white"
              >✕</button>

              <h2 className="text-lg font-semibold text-white mb-4">Reach out to {selectedOrg.name}</h2>
              <p className="text-xs text-gray-400 mb-4">Express your interest and showcase your past work</p>

              <textarea
                placeholder="Write a message to the brand..."
                className="w-full h-24 bg-black border border-gray-800 rounded p-3 text-xs text-white mb-4 resize-none"
              ></textarea>

              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-2">Attach Past Work (links or files)</label>
                <input 
                  type="file" 
                  className="w-full text-xs text-gray-400 bg-black border border-gray-700 rounded px-2 py-2 cursor-pointer"
                />
              </div>

              <button className="w-full px-4 py-2 text-xs bg-gray-900 border border-gray-700 rounded hover:border-gray-500 transition">
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse_influencer;
