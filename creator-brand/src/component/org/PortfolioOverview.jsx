import React, { memo } from 'react';
import { 
  Plus,
  Eye,
  Camera,
  Edit3,
  Award,
  Briefcase,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-react';

const PortfolioOverview = memo(({ setIsProfileModalOpen }) => (
  <div className="space-y-8">
    <div className="bg-white rounded-xl p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-black">My Portfolio</h2>
        <button 
          onClick={() => setIsProfileModalOpen(true)}
          className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
          aria-label="Add new portfolio work"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Work
        </button>
      </div>
    </div>
    
    <div className="bg-neutral-800 rounded-xl p-8 border border-neutral-700">
      <div className="flex items-start gap-8">
        <div className="relative">
          <img 
            src="/api/placeholder/120/120" 
            alt="Profile picture" 
            className="w-20 h-20 rounded-full object-cover border-2 border-neutral-700"
            onError={(e) => (e.target.src = '/fallback-image.jpg')}
          />
          <button 
            className="absolute -bottom-1 -right-1 bg-neutral-700 text-white p-1 rounded-full hover:bg-neutral-600"
            aria-label="Change profile picture"
          >
            <Camera className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">Alex Johnson</h3>
            <button className="text-neutral-300 hover:text-white" aria-label="Edit profile">
              <Edit3 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <p className="text-neutral-300 text-xs mb-3">Lifestyle & Tech Content Creator</p>
          <div className="flex gap-4 text-xs text-neutral-300">
            <span>📍 Los Angeles, CA</span>
            <span>🎂 25 years old</span>
            <span>📧 alex.johnson@email.com</span>
          </div>
          
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 bg-neutral-700 px-3 py-1 rounded-full">
              <Instagram className="w-4 h-4 text-white" aria-hidden="true" />
              <span className="text-white text-xs font-medium">145K</span>
            </div>
            <div className="flex items-center gap-2 bg-neutral-700 px-3 py-1 rounded-full">
              <Youtube className="w-4 h-4 text-white" aria-hidden="true" />
              <span className="text-white text-xs font-medium">89K</span>
            </div>
            <div className="flex items-center gap-2 bg-neutral-700 px-3 py-1 rounded-full">
              <Twitter className="w-4 h-4 text-white" aria-hidden="true" />
              <span className="text-white text-xs font-medium">67K</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="bg-neutral-700 text-white px-3 py-1 rounded-full text-xs mb-2">
            ⭐ 4.9/5 Rating
          </div>
          <p className="text-neutral-300 text-xs">127 Completed Projects</p>
        </div>
      </div>
    </div>

    <div className="bg-neutral-800 rounded-xl p-8 border border-neutral-700">
      <h3 className="text-base font-semibold text-white mb-4">Skills & Expertise</h3>
      <div className="flex flex-wrap gap-2">
        {['Fashion', 'Technology', 'Lifestyle', 'Fitness', 'Travel', 'Food', 'Beauty', 'Gaming'].map((skill) => (
          <span key={skill} className="bg-neutral-700 text-white px-3 py-1 rounded-full text-xs">
            {skill}
          </span>
        ))}
      </div>
    </div>

    <div className="bg-neutral-800 rounded-xl p-8 border border-neutral-700">
      <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
        <Briefcase className="w-4 h-4" aria-hidden="true" />
        Past Work Experience
      </h3>
      
      <div className="space-y-6">
        {[
          {
            brand: 'Nike',
            campaign: 'Air Max Campaign 2024',
            date: 'March 2024',
            platform: 'Instagram + TikTok',
            results: '2.3M impressions, 4.8% engagement',
            image: '/api/placeholder/80/80'
          },
          {
            brand: 'Apple',
            campaign: 'iPhone 15 Pro Review',
            date: 'February 2024',
            platform: 'YouTube',
            results: '890K views, 15K likes',
            image: '/api/placeholder/80/80'
          },
          {
            brand: 'Starbucks',
            campaign: 'Summer Menu Launch',
            date: 'January 2024',
            platform: 'Instagram Stories',
            results: '156K story views, 3.2% CTR',
            image: '/api/placeholder/80/80'
          }
        ].map((work, index) => (
          <div key={index} className="bg-neutral-700 rounded-lg p-6 hover:bg-neutral-600 transition-colors">
            <div className="flex items-center gap-6">
              <img 
                src={work.image} 
                alt={`${work.brand} campaign`} 
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => (e.target.src = '/fallback-image.jpg')}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-white text-sm">{work.brand}</h4>
                  <span className="text-xs text-neutral-300">{work.date}</span>
                </div>
                <p className="text-neutral-300 text-xs mb-2">{work.campaign}</p>
                <div className="flex items-center gap-4 text-xs text-neutral-300">
                  <span className="bg-neutral-600 px-2 py-1 rounded">{work.platform}</span>
                  <span>{work.results}</span>
                </div>
              </div>
              <button className="text-white hover:text-neutral-300" aria-label={`View ${work.brand} campaign details`}>
                <Eye className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-neutral-800 rounded-xl p-8 border border-neutral-700">
      <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
        <Award className="w-4 h-4" aria-hidden="true" />
        Awards & Recognition
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { title: 'Top Creator 2024', org: 'InfluencerHub Awards', date: 'Dec 2024' },
          { title: 'Best Tech Reviewer', org: 'Digital Content Awards', date: 'Nov 2024' },
          { title: 'Rising Star', org: 'Social Media Excellence', date: 'Oct 2024' },
          { title: 'Brand Partnership Excellence', org: 'Creator Economy Summit', date: 'Sep 2024' }
        ].map((award, index) => (
          <div key={index} className="bg-neutral-700 border border-neutral-600 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-neutral-600 p-2 rounded-full">
                <Award className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-medium text-white text-sm">{award.title}</h4>
                <p className="text-xs text-neutral-300">{award.org}</p>
                <p className="text-xs text-neutral-300">{award.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
));

export default PortfolioOverview;