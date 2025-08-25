import React, { memo } from 'react';
import useAuthStore from '../../store/authStore';
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

const PortfolioOverview = memo(({ setIsProfileModalOpen }) => {
  const { user: profile } = useAuthStore(); // ✅ FIXED: Hook inside component

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">My Portfolio</h2>
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="bg-gray-950 hover:bg-gray-900 border border-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
            aria-label="Add new portfolio work"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Add Work
          </button>
        </div>
      </div>
      
      {/* Profile Card */}
      <div className="bg-gray-950 rounded-xl p-8 border border-gray-800">
        <div className="flex items-start gap-8">
          <div className="relative">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI39jmnqGugnR-LKaHU6za8QqCi9JO541veg&s" 
              alt="Profile picture" 
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-800"
              onError={(e) => (e.target.src = '/fallback-image.jpg')}
            />
            <button 
              className="absolute -bottom-1 -right-1 bg-gray-800 hover:bg-gray-700 text-white p-1 rounded-full"
              aria-label="Change profile picture"
            >
              <Camera className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-white">{profile?.name || "User"}</h3>
              <button className="text-gray-400 hover:text-white" aria-label="Edit profile">
                <Edit3 className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <p className="text-gray-400 text-xs mb-3">Lifestyle & Tech Content Creator</p>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>📍 Los Angeles, CA</span>
              <span>🎂 25 years old</span>
              <span>📧 alex.johnson@email.com</span>
            </div>
            
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
                <Instagram className="w-4 h-4 text-pink-400" aria-hidden="true" />
                <span className="text-white text-xs font-medium">145K</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
                <Youtube className="w-4 h-4 text-red-400" aria-hidden="true" />
                <span className="text-white text-xs font-medium">89K</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
                <Twitter className="w-4 h-4 text-blue-400" aria-hidden="true" />
                <span className="text-white text-xs font-medium">67K</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs mb-2">
              ⭐ 4.9/5 Rating
            </div>
            <p className="text-gray-400 text-xs">127 Completed Projects</p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-gray-950 rounded-xl p-8 border border-gray-800">
        <h3 className="text-base font-semibold text-white mb-4">Skills & Expertise</h3>
        <div className="flex flex-wrap gap-2">
          {['Fashion', 'Technology', 'Lifestyle', 'Fitness', 'Travel', 'Food', 'Beauty', 'Gaming'].map((skill) => (
            <span key={skill} className="bg-gray-800 text-gray-200 px-3 py-1 rounded-full text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Work Experience */}
      <div className="bg-gray-950 rounded-xl p-8 border border-gray-800">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-400" aria-hidden="true" />
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
              image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI39jmnqGugnR-LKaHU6za8QqCi9JO541veg&s'
            },
            {
              brand: 'Apple',
              campaign: 'iPhone 15 Pro Review',
              date: 'February 2024',
              platform: 'YouTube',
              results: '890K views, 15K likes',
              image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI39jmnqGugnR-LKaHU6za8QqCi9JO541veg&s'
            },
            {
              brand: 'Starbucks',
              campaign: 'Summer Menu Launch',
              date: 'January 2024',
              platform: 'Instagram Stories',
              results: '156K story views, 3.2% CTR',
              image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI39jmnqGugnR-LKaHU6za8QqCi9JO541veg&s'
            }
          ].map((work, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-6">
                <img 
                  src={work.image} 
                  alt={`${work.brand} campaign`} 
                  className="w-16 h-16 rounded-lg object-cover border border-gray-700"
                  onError={(e) => (e.target.src = '/fallback-image.jpg')}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-white text-sm">{work.brand}</h4>
                    <span className="text-xs text-gray-400">{work.date}</span>
                  </div>
                  <p className="text-gray-400 text-xs mb-2">{work.campaign}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-300">
                    <span className="bg-gray-800 px-2 py-1 rounded">{work.platform}</span>
                    <span>{work.results}</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white" aria-label={`View ${work.brand} campaign details`}>
                  <Eye className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Awards */}
      <div className="bg-gray-950 rounded-xl p-8 border border-gray-800">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-yellow-400" aria-hidden="true" />
          Awards & Recognition
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Top Creator 2024', org: 'InfluencerHub Awards', date: 'Dec 2024' },
            { title: 'Best Tech Reviewer', org: 'Digital Content Awards', date: 'Nov 2024' },
            { title: 'Rising Star', org: 'Social Media Excellence', date: 'Oct 2024' },
            { title: 'Brand Partnership Excellence', org: 'Creator Economy Summit', date: 'Sep 2024' }
          ].map((award, index) => (
            <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-gray-800 p-2 rounded-full">
                  <Award className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">{award.title}</h4>
                  <p className="text-xs text-gray-400">{award.org}</p>
                  <p className="text-xs text-gray-500">{award.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default PortfolioOverview;
