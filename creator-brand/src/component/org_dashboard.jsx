import React from 'react';

function Sidebar() {
  return (
    <div className="sidebar fixed bg-[#2d2d2d]/90 backdrop-blur-md m-4 rounded-xl p-6 w-64 h-[calc(100vh-2rem)] flex flex-col shadow-lg">
      <div className="flex items-center gap-3 mb-8">
        <div>
          <img className='w-8 h-8' src="src/assets/img/logo.png" alt="logo" />
        </div>
        <h2 className="text-xl font-bold font-satoshi text-white">LinkFluence</h2>
      </div>
      <nav className="flex-1">
        {[
          { name: 'Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2M9 19' },
          { name: 'Campaigns', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V15h5.488' },
          { name: 'Influencers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
          { name: 'Payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
          { name: 'Analytics', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
        ].map((item) => (
          <div
            key={item.name}
            className="sidebar-item flex items-center gap-3 mb-2 p-3 rounded-lg cursor-pointer hover:bg-[#4a4a4a]/80 hover:shadow-md transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
            </svg>
            <span>{item.name}</span>
          </div>
        ))}
      </nav>
      <div className="mt-auto">
        <div className="flex items-center gap-3 p-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-bold">JD</div>
          <span className="text-sm">John Doe</span>
        </div>
        <button className="w-full mt-2 p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="flex bg-black min-h-screen text-white font-['Inter']">
      <Sidebar />
      <div className="main-content ml-[290px] m-4 p-8 bg-[#262626]/90 backdrop-blur-md rounded-xl flex-grow shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Brand Dashboard</h1>
          <div className="text-sm text-gray-400">Last updated: Aug 4, 2025</div>
        </div>

        {/* Overview Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[
            { title: 'Active Campaigns', value: '12', subtext: '3 new this week', gradient: 'from-gray-700 to-gray-900' },
            { title: 'Connected Influencers', value: '45', subtext: '15 micro-influencers', gradient: 'from-gray-700 to-gray-900' },
            { title: 'ROI This Month', value: '3.2x', subtext: 'Up 20% from last month', gradient: 'from-gray-700 to-gray-900' },
          ].map((card) => (
            <div
              key={card.title}
              className={`card bg-[#333333]/90 backdrop-blur-sm rounded-xl p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${card.gradient}`}
            >
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-4xl font-bold">{card.value}</p>
              <p className="text-sm text-gray-400 mt-1">{card.subtext}</p>
            </div>
          ))}
        </div>

        {/* Campaign Overview */}
        <div className="card bg-[#333333]/90 backdrop-blur-sm rounded-xl p-6 mb-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4">Campaign Overview</h2>
          <div className="chart-placeholder h-64 bg-[#4a4a4a]/80 rounded-lg flex items-center justify-center text-gray-300">
            Interactive Campaign Performance Chart
          </div>
        </div>

        {/* Recent Influencer Matches */}
        <div className="card bg-[#333333]/90 backdrop-blur-sm rounded-xl p-6 mb-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4">Recent Influencer Matches</h2>
          <div className="space-y-4">
            {[
              { name: 'Jane Doe', platform: 'Instagram', followers: '25K followers' },
              { name: 'John Smith', platform: 'YouTube', followers: '40K subscribers' },
            ].map((influencer) => (
              <div key={influencer.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#4a4a4a]/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-bold">
                    {influencer.name[0]}
                  </div>
                  <div>
                    <p className="font-medium">{influencer.name}</p>
                    <p className="text-sm text-gray-400">{influencer.platform}, {influencer.followers}</p>
                  </div>
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                  Contact
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Status */}
        <div className="card bg-[#333333]/90 backdrop-blur-sm rounded-xl p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
          <div className="space-y-4">
            {[
              { id: '#1234', status: 'Paid (Escrow Released)', color: 'text-green-400' },
              { id: '#1235', status: 'Pending (In Escrow)', color: 'text-yellow-400' },
            ].map((payment) => (
              <div key={payment.id} className="flex justify-between p-3 rounded-lg hover:bg-[#4a4a4a]/50 transition-colors">
                <p>{payment.id}</p>
                <p className={payment.color}>{payment.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;