import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  MoreHorizontal,
  Paperclip,
  Trash2
} from 'lucide-react';

// Utility function to generate a consistent background color based on brand name
const getAvatarColor = (brand) => {
  const colors = [
    'bg-blue-600',
    'bg-green-600',
    'bg-purple-600',
    'bg-red-600',
    'bg-yellow-600',
    'bg-teal-600',
  ];
  const index = brand.charCodeAt(0) % colors.length;
  return colors[index];
};

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Unread', 'Archived'];

  // Sample conversation data
  const conversations = [
    {
      id: 1,
      brand: 'Nike',
      lastMessage: 'We love your content! Can we discuss the campaign details?',
      timestamp: '2025-08-15 14:30',
      status: 'unread',
      campaign: 'Summer Collection Launch',
      avatar: 'N'
    },
    {
      id: 2,
      brand: 'EcoWear',
      lastMessage: 'Please confirm the deliverables for next week.',
      timestamp: '2025-08-14 09:15',
      status: 'read',
      campaign: 'Sustainable Fashion Haul',
      avatar: 'E'
    },
    {
      id: 3,
      brand: 'TechCorp',
      lastMessage: 'Can you share the draft content for review?',
      timestamp: '2025-08-13 16:45',
      status: 'unread',
      campaign: 'Tech Review Series',
      avatar: 'T'
    },
    {
      id: 4,
      brand: 'GlowBeauty',
      lastMessage: 'Thanks for the great work on the campaign!',
      timestamp: '2025-08-12 11:20',
      status: 'read',
      campaign: 'Skincare Routine Tutorial',
      avatar: 'G'
    }
  ];

  // Sample messages for selected conversation
  const messages = [
    {
      id: 1,
      sender: 'Nike',
      content: 'Hi! We’re excited about the Summer Collection Launch. Can we set up a call to discuss details?',
      timestamp: '2025-08-15 14:30',
      isBrand: true
    },
    {
      id: 2,
      sender: 'You',
      content: 'Absolutely, I’m thrilled to collaborate! When’s a good time for you?',
      timestamp: '2025-08-15 14:35',
      isBrand: false
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'text-blue-400 bg-blue-500/10';
      case 'read': return 'text-gray-400 bg-gray-500/10';
      case 'archived': return 'text-yellow-400 bg-yellow-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'unread': return MessageSquare;
      case 'read': return CheckCircle;
      case 'archived': return XCircle;
      default: return MessageSquare;
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesFilter = selectedFilter === 'All' || conv.status === selectedFilter.toLowerCase();
    const matchesSearch = conv.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.campaign.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Logic to send message (API call would go here)
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans text-sm leading-relaxed">
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Messages</h1>
            <p className="text-gray-400 text-xs">Manage your brand communications</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-xs border border-gray-800 rounded bg-gray-950 hover:border-gray-600 hover:bg-gray-900 transition-colors flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Clear Archived
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Conversation List */}
          <div className="col-span-4 bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search brands or campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none text-xs w-full"
                />
              </div>
              <div className="flex gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1.5 text-xs border border-gray-800 rounded transition-colors ${
                      selectedFilter === filter
                        ? 'bg-gray-900 border-gray-600 text-white'
                        : 'bg-black border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-gray-800">
              {filteredConversations.map((conv, index) => {
                const StatusIcon = getStatusIcon(conv.status);
                return (
                  <motion.div
                    key={conv.id}
                    className={`p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-900/30 transition-colors ${
                      selectedConversation?.id === conv.id ? 'bg-gray-900' : ''
                    }`}
                    onClick={() => setSelectedConversation(conv)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className={`w-10 h-10 ${getAvatarColor(conv.brand)} rounded-full flex items-center justify-center border border-gray-700 text-white font-medium text-sm`}>
                      <span>{conv.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium text-white">{conv.brand}</div>
                          <div className="text-xs text-gray-400 truncate max-w-[200px]">{conv.lastMessage}</div>
                        </div>
                        <div className={`p-1 rounded-full ${getStatusColor(conv.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{conv.campaign}</div>
                      <div className="text-xs text-gray-400 mt-1">{conv.timestamp}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Conversation View */}
          <div className="col-span-8 bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
            {selectedConversation ? (
              <div className="flex flex-col h-full">
                {/* Conversation Header */}
                <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${getAvatarColor(selectedConversation.brand)} rounded-full flex items-center justify-center border border-gray-700 text-white font-medium text-sm`}>
                      <span>{selectedConversation.avatar}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{selectedConversation.brand}</div>
                      <div className="text-xs text-gray-400">{selectedConversation.campaign}</div>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`flex ${msg.isBrand ? 'justify-start' : 'justify-end'} mb-4`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className={`max-w-[70%] rounded-lg p-3 ${
                        msg.isBrand ? 'bg-gray-900 text-white' : 'bg-blue-500 text-white'
                      }`}>
                        <div className="text-xs font-medium">{msg.sender}</div>
                        <div className="text-sm mt-1">{msg.content}</div>
                        <div className="text-xs text-gray-400 mt-1">{msg.timestamp}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-800">
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Select a conversation to view messages
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;