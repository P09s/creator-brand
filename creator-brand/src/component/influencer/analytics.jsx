import React, { useState, useEffect, useRef } from 'react';
import * as Chart from 'chart.js';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7 Days');
  const engagementChartRef = useRef(null);
  const contentChartRef = useRef(null);
  const engagementChartInstance = useRef(null);
  const contentChartInstance = useRef(null);

  const periods = ['7 Days', '30 Days', '90 Days', '1 Year'];

  useEffect(() => {
    // Register Chart.js components
    Chart.Chart.register(...Chart.registerables);

    // Set Chart.js defaults for dark theme
    Chart.Chart.defaults.color = '#666666';
    Chart.Chart.defaults.borderColor = '#1a1a1a';
    Chart.Chart.defaults.backgroundColor = '#0a0a0a';

    // Initialize charts
    initEngagementChart();
    initContentChart();

    return () => {
      // Cleanup charts on unmount
      if (engagementChartInstance.current) {
        engagementChartInstance.current.destroy();
      }
      if (contentChartInstance.current) {
        contentChartInstance.current.destroy();
      }
    };
  }, []);

  const initEngagementChart = () => {
    const ctx = engagementChartRef.current?.getContext('2d');
    if (!ctx) return;

    engagementChartInstance.current = new Chart.Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Likes',
          data: [12000, 15000, 18000, 14000, 22000, 25000, 20000],
          borderColor: '#ffffff',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              color: '#1a1a1a'
            }
          },
          y: {
            grid: {
              color: '#1a1a1a'
            }
          }
        }
      }
    });
  };

  const initContentChart = () => {
    const ctx = contentChartRef.current?.getContext('2d');
    if (!ctx) return;

    contentChartInstance.current = new Chart.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Posts', 'Stories', 'Reels', 'Videos'],
        datasets: [{
          data: [35, 25, 25, 15],
          backgroundColor: ['#444444', '#333333', '#555555', '#2a2a2a'],
          borderColor: '#000000',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 11
              }
            }
          }
        }
      }
    });
  };

  const statsData = [
    {
      title: 'Total Reach',
      value: '2.4M',
      subtitle: 'Unique accounts reached',
      trend: '+12.5%',
      trendType: 'up'
    },
    {
      title: 'Engagement Rate',
      value: '4.8%',
      subtitle: 'Average engagement rate',
      trend: '+3.2%',
      trendType: 'up'
    },
    {
      title: 'Followers',
      value: '125.3K',
      subtitle: 'Total followers',
      trend: '+8.1%',
      trendType: 'up'
    },
    {
      title: 'Earnings',
      value: '$2,340',
      subtitle: 'This month',
      trend: '+22.7%',
      trendType: 'up'
    }
  ];

  const contentData = [
    {
      type: 'Instagram Post',
      title: 'Morning skincare routine essentials',
      likes: '24.5K',
      comments: '892',
      shares: '3.2K'
    },
    {
      type: 'TikTok Video',
      title: 'Quick workout for busy days',
      likes: '18.7K',
      comments: '456',
      shares: '2.1K'
    },
    {
      type: 'YouTube Short',
      title: 'Sustainable fashion haul',
      likes: '15.3K',
      comments: '334',
      shares: '1.8K'
    }
  ];

  const ageData = [
    { label: '18-24', percentage: 45 },
    { label: '25-34', percentage: 32 },
    { label: '35-44', percentage: 15 },
    { label: '45+', percentage: 8 }
  ];

  const locationData = [
    { label: 'United States', percentage: 38 },
    { label: 'United Kingdom', percentage: 22 },
    { label: 'Canada', percentage: 15 },
    { label: 'Australia', percentage: 12 }
  ];

  const earningsData = [
    { label: 'Sponsored Posts', amount: '$1,240' },
    { label: 'Affiliate Marketing', amount: '$680' },
    { label: 'Brand Partnerships', amount: '$420' }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans text-sm leading-relaxed">
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Analytics</h1>
            <p className="text-gray-500 text-xs">Track your performance and engagement metrics</p>
          </div>
          <div className="flex gap-3">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 text-xs border border-gray-800 rounded transition-colors ${
                  selectedPeriod === period 
                    ? 'bg-gray-900 border-gray-600 text-white' 
                    : 'bg-black border-gray-800 text-white hover:border-gray-600 hover:bg-gray-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Main Stats Overview */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-gray-950 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.title}</div>
                <div className={`text-xs px-2 py-1 rounded font-medium ${
                  stat.trendType === 'up' 
                    ? 'bg-green-500/10 text-green-400' 
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {stat.trend}
                </div>
              </div>
              <div className="text-3xl font-semibold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.subtitle}</div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          <div className="col-span-2 bg-gray-950 border border-gray-800 rounded-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm font-semibold text-white">Engagement Overview</div>
              <select className="bg-black border border-gray-800 rounded px-2 py-1 text-xs text-white cursor-pointer">
                <option>Likes</option>
                <option>Comments</option>
                <option>Shares</option>
                <option>Saves</option>
              </select>
            </div>
            <div className="h-80 relative">
              <canvas ref={engagementChartRef}></canvas>
            </div>
          </div>
          
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm font-semibold text-white">Top Content Types</div>
            </div>
            <div className="h-80 relative">
              <canvas ref={contentChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Content Performance */}
        <div className="mb-12">
          <h2 className="text-base font-semibold text-white mb-6 pb-2 border-b border-gray-800">
            Top Performing Content
          </h2>
          <div className="grid grid-cols-3 gap-5">
            {contentData.map((content, index) => (
              <div key={index} className="bg-gray-950 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
                <div className="text-xs text-gray-600 uppercase mb-2">{content.type}</div>
                <div className="text-xs text-white mb-3 font-medium">{content.title}</div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-xs font-semibold text-white mb-1">{content.likes}</div>
                    <div className="text-xs text-gray-600">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-white mb-1">{content.comments}</div>
                    <div className="text-xs text-gray-600">Comments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-white mb-1">{content.shares}</div>
                    <div className="text-xs text-gray-600">Shares</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Demographics */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-6 pb-2 border-b border-gray-800">
              Age Distribution
            </h2>
            <div className="space-y-2">
              {ageData.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-900 last:border-b-0">
                  <span className="text-xs text-white">{item.label}</span>
                  <div className="flex items-center gap-2 flex-1 max-w-48">
                    <div className="flex-1 h-1 bg-gray-800 rounded overflow-hidden">
                      <div 
                        className="h-full bg-gray-600 transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 min-w-8 text-right">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-6 pb-2 border-b border-gray-800">
              Top Locations
            </h2>
            <div className="space-y-2">
              {locationData.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-900 last:border-b-0">
                  <span className="text-xs text-white">{item.label}</span>
                  <div className="flex items-center gap-2 flex-1 max-w-48">
                    <div className="flex-1 h-1 bg-gray-800 rounded overflow-hidden">
                      <div 
                        className="h-full bg-gray-600 transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 min-w-8 text-right">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-8">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-white pb-2 border-b border-gray-800">
              Earnings Breakdown
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {earningsData.map((earning, index) => (
              <div key={index} className="text-center p-5 border border-gray-800 rounded-lg">
                <div className="text-xl font-semibold text-white mb-1">{earning.amount}</div>
                <div className="text-xs text-gray-600 uppercase">{earning.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;