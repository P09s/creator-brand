import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Download,
  Filter,
  Search,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Building,
  User,
  MoreHorizontal
} from 'lucide-react';

const Payments = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 Days');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentDetails, setShowPaymentDetails] = useState(null);

  const periods = ['7 Days', '30 Days', '90 Days', '1 Year'];
  const filters = ['All', 'Pending', 'Completed', 'Failed'];

  // Sample payment data
  const paymentStats = [
    {
      title: 'Total Earnings',
      value: '$12,450',
      subtitle: 'This month',
      trend: '+18.5%',
      trendType: 'up',
      icon: DollarSign
    },
    {
      title: 'Pending Payments',
      value: '$3,240',
      subtitle: '5 campaigns',
      trend: '+12.3%',
      trendType: 'up',
      icon: Clock
    },
    {
      title: 'Completed Payments',
      value: '$9,210',
      subtitle: '12 campaigns',
      trend: '+22.1%',
      trendType: 'up',
      icon: CheckCircle
    },
    {
      title: 'Average Per Campaign',
      value: '$1,035',
      subtitle: 'Last 30 days',
      trend: '+8.7%',
      trendType: 'up',
      icon: TrendingUp
    }
  ];

  const recentPayments = [
    {
      id: 1,
      campaignName: 'Nike Summer Collection Launch',
      brand: 'Nike',
      amount: '$2,500',
      status: 'completed',
      date: '2024-08-15',
      type: 'Instagram Campaign',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN123456789'
    },
    {
      id: 2,
      campaignName: 'Sustainable Fashion Haul',
      brand: 'EcoWear',
      amount: '$1,200',
      status: 'pending',
      date: '2024-08-14',
      type: 'YouTube Collaboration',
      paymentMethod: 'PayPal',
      transactionId: 'TXN987654321'
    },
    {
      id: 3,
      campaignName: 'Tech Review Series',
      brand: 'TechCorp',
      amount: '$3,800',
      status: 'completed',
      date: '2024-08-12',
      type: 'Multi-platform',
      paymentMethod: 'Direct Deposit',
      transactionId: 'TXN456789123'
    },
    {
      id: 4,
      campaignName: 'Skincare Routine Tutorial',
      brand: 'GlowBeauty',
      amount: '$800',
      status: 'failed',
      date: '2024-08-10',
      type: 'TikTok Campaign',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN789123456'
    },
    {
      id: 5,
      campaignName: 'Fitness Challenge Series',
      brand: 'FitLife',
      amount: '$1,500',
      status: 'pending',
      date: '2024-08-08',
      type: 'Instagram Reels',
      paymentMethod: 'PayPal',
      transactionId: 'TXN654321987'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10';
      case 'pending': return 'text-yellow-400 bg-yellow-500/10';
      case 'failed': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'pending': return Clock;
      case 'failed': return XCircle;
      default: return Clock;
    }
  };

  const filteredPayments = recentPayments.filter(payment => {
    const matchesFilter = selectedFilter === 'All' || payment.status === selectedFilter.toLowerCase();
    const matchesSearch = payment.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans text-sm leading-relaxed">
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Payments</h1>
            <p className="text-gray-400 text-xs">Track your earnings and payment history</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-xs border border-gray-800 rounded bg-gray-950 hover:border-gray-600 hover:bg-gray-900 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
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

        {/* Payment Stats Overview */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {paymentStats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="bg-gray-950 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-900 rounded-lg border border-gray-800">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className={`text-xs px-2 py-1 rounded font-medium ${
                  stat.trendType === 'up' 
                    ? 'bg-green-500/10 text-green-400' 
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {stat.trend}
                </div>
              </div>
              <div className="text-3xl font-semibold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.title}</div>
              <div className="text-xs text-gray-600 mt-1">{stat.subtitle}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 text-xs border border-gray-800 rounded transition-colors ${
                  selectedFilter === filter
                    ? 'bg-gray-900 border-gray-600 text-white'
                    : 'bg-black border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns or brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none text-xs w-64"
            />
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-base font-semibold text-white">Payment History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Campaign</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Brand</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredPayments.map((payment, index) => {
                  const StatusIcon = getStatusIcon(payment.status);
                  return (
                    <motion.tr 
                      key={payment.id}
                      className="hover:bg-gray-900/30 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-white">{payment.campaignName}</div>
                          <div className="text-xs text-gray-400">{payment.type}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                            <Building className="w-4 h-4 text-gray-400" />
                          </div>
                          <span className="text-sm text-white">{payment.brand}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-white">{payment.amount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300">{payment.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowPaymentDetails(payment)}
                            className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                            title="More Options"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Details Modal */}
        <AnimatePresence>
          {showPaymentDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setShowPaymentDetails(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-950 border border-gray-800 rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Payment Details</h3>
                    <p className="text-xs text-gray-400">Transaction Information</p>
                  </div>
                  <button
                    onClick={() => setShowPaymentDetails(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Campaign</label>
                      <p className="text-sm font-medium text-white mt-1">{showPaymentDetails.campaignName}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Brand</label>
                      <p className="text-sm font-medium text-white mt-1">{showPaymentDetails.brand}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Amount</label>
                      <p className="text-lg font-semibold text-white mt-1">{showPaymentDetails.amount}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Status</label>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(showPaymentDetails.status)}`}>
                        {React.createElement(getStatusIcon(showPaymentDetails.status), { className: "w-3 h-3" })}
                        {showPaymentDetails.status.charAt(0).toUpperCase() + showPaymentDetails.status.slice(1)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Payment Method</label>
                      <p className="text-sm font-medium text-white mt-1">{showPaymentDetails.paymentMethod}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Date</label>
                      <p className="text-sm font-medium text-white mt-1">{showPaymentDetails.date}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider">Transaction ID</label>
                    <p className="text-sm font-mono text-white mt-1 bg-gray-900 px-3 py-2 rounded border border-gray-800">
                      {showPaymentDetails.transactionId}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
                  <button className="flex-1 px-4 py-2 bg-gray-900 text-white border border-gray-800 rounded-lg hover:bg-gray-800 hover:border-gray-700 transition-colors text-sm">
                    Download Receipt
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-colors text-sm">
                    Contact Support
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Payments;