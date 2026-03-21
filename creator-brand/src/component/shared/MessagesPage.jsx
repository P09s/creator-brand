import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Search, ArrowLeft, Loader2, MessageSquare,
  CheckCheck, Check, AlertCircle, User
} from 'lucide-react';
import { getConversations, getMessagesWithUser, sendMessage } from '../../services/apiService';
import useAuthStore from '../../store/authStore';
import Avatar from './Avatar';
import toast from 'react-hot-toast';

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function fullTime(iso) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// Avatar imported from shared

// ── Context banner (shows when navigated from campaign/browse) ─────────────────

function ContextBanner({ context }) {
  if (!context) return null;
  return (
    <div className="mx-4 mt-3 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
      <AlertCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
      <p className="text-blue-300 text-xs">{context}</p>
    </div>
  );
}

// ── Conversation list item ─────────────────────────────────────────────────────

function ConvItem({ conv, isSelected, onClick }) {
  const { user: other, lastMessage, unread } = conv;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-900/60 transition-colors text-left border-b border-gray-800/50 last:border-b-0 ${isSelected ? 'bg-gray-900' : ''}`}
    >
      <div className="relative flex-shrink-0">
        <Avatar src={conv.profile?.avatar} name={other?.name} size="md" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <p className={`text-sm font-medium truncate ${unread > 0 ? 'text-white' : 'text-gray-300'}`}>
            {other?.name}
          </p>
          <span className="text-gray-600 text-xs flex-shrink-0">{timeAgo(lastMessage?.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-xs truncate flex-1 ${unread > 0 ? 'text-gray-300' : 'text-gray-500'}`}>
            {lastMessage?.content || 'Start a conversation'}
          </span>
          <span className="text-gray-600 text-xs flex-shrink-0 capitalize">
            {other?.userType === 'brand' ? '· Brand' : '· Creator'}
          </span>
        </div>
      </div>
    </button>
  );
}

// ── Message bubble ─────────────────────────────────────────────────────────────

function Bubble({ msg, isMine }) {
  return (
    <div className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'} mb-3`}>
      <div
        className={`max-w-[72%] sm:max-w-[60%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words ${
          isMine
            ? 'bg-white text-black rounded-br-sm'
            : 'bg-gray-800 text-gray-100 rounded-bl-sm'
        }`}
      >
        {msg.content}
        <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-xs ${isMine ? 'text-gray-400' : 'text-gray-500'}`}>
            {fullTime(msg.createdAt)}
          </span>
          {isMine && (
            msg.read
              ? <CheckCheck className="w-3 h-3 text-blue-400" />
              : <Check className="w-3 h-3 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Day separator ──────────────────────────────────────────────────────────────

function DaySep({ date }) {
  const label = (() => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
  })();
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gray-800" />
      <span className="text-gray-600 text-xs">{label}</span>
      <div className="flex-1 h-px bg-gray-800" />
    </div>
  );
}

// ── Main Messages Page ─────────────────────────────────────────────────────────

export default function MessagesPage({ dashboardBase }) {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // ?with=userId auto-opens a conversation
  const withUserId = searchParams.get('with');
  // ?context=text shows a banner (e.g. "Reaching out about Summer Campaign")
  const contextText = searchParams.get('context');

  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(withUserId || null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showList, setShowList] = useState(true); // mobile: toggle between list/chat
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  // ── Load conversations ──────────────────────────────────────────────────────

  const fetchConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data);

      // If ?with param, find/set the user info from conversations
      if (withUserId && !selectedUser) {
        const found = data.find(c => c.user?._id === withUserId);
        if (found) setSelectedUser(found.user);
      }
    } catch {
      // silent
    } finally {
      setLoadingConvs(false);
    }
  }, [withUserId, selectedUser]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // ── Load messages when a conversation is selected ──────────────────────────

  const fetchMessages = useCallback(async (userId, isPolling = false) => {
    if (!userId) return;
    if (!isPolling) setLoadingMsgs(true);
    try {
      const data = await getMessagesWithUser(userId);
      if (isPolling) {
        // Fire notification only for genuinely new incoming messages
        setMessages(prev => {
          const prevIds = new Set(prev.map(m => m._id));
          const newIncoming = data.filter(
            m => !prevIds.has(m._id) &&
            (m.sender === userId || m.sender?._id === userId)
          );
          if (newIncoming.length > 0 && selectedUser) {
            import('../../store/notificationStore').then(({ notifyNewMessage }) => {
              notifyNewMessage(
                selectedUser.name,
                newIncoming[newIncoming.length - 1].content,
                `${dashboardBase}/messages?with=${userId}`
              );
            });
          }
          return data;
        });
      } else {
        setMessages(data);
      }
    } catch {
      if (!isPolling) setMessages([]);
    } finally {
      if (!isPolling) setLoadingMsgs(false);
    }
  }, [selectedUser, dashboardBase]);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId, true);
      setShowList(false); // mobile: switch to chat view
    }
  }, [selectedUserId, fetchMessages]);

  // ── Poll for new messages every 5 seconds ──────────────────────────────────

  useEffect(() => {
    if (!selectedUserId) return;
    pollRef.current = setInterval(() => {
      fetchMessages(selectedUserId, true);
      fetchConversations();
    }, 5000);
    return () => clearInterval(pollRef.current);
  }, [selectedUserId, fetchMessages, fetchConversations]);

  // ── Auto-scroll to bottom ─────────────────────────────────────────────────

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Handle conversation select ─────────────────────────────────────────────

  const selectConversation = (conv) => {
    setSelectedUserId(conv.user._id);
    setSelectedUser(conv.user);
    // Update unread count locally
    setConversations(prev =>
      prev.map(c => c.user._id === conv.user._id ? { ...c, unread: 0 } : c)
    );
  };

  // ── Send message ──────────────────────────────────────────────────────────

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !selectedUserId || sending) return;
    setSending(true);
    const optimistic = {
      _id: 'tmp_' + Date.now(),
      sender: user._id,
      receiver: selectedUserId,
      content: text,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    setInput('');
    try {
      const saved = await sendMessage(selectedUserId, text);
      setMessages(prev => prev.map(m => m._id === optimistic._id ? saved : m));
      fetchConversations();
    } catch {
      setMessages(prev => prev.filter(m => m._id !== optimistic._id));
      toast.error('Message failed to send');
    } finally {
      setSending(false);
    }
  };

  // ── Group messages by date for day separators ─────────────────────────────

  const grouped = messages.reduce((acc, msg) => {
    const day = new Date(msg.createdAt).toDateString();
    if (!acc.length || acc[acc.length - 1].day !== day) {
      acc.push({ day, msgs: [msg] });
    } else {
      acc[acc.length - 1].msgs.push(msg);
    }
    return acc;
  }, []);

  const filteredConvs = conversations.filter(c =>
    !searchQuery || c.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Empty state for first-time users ─────────────────────────────────────

  const EmptyConversations = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
        <MessageSquare className="w-7 h-7 text-gray-600" />
      </div>
      <p className="text-white font-medium mb-2">No messages yet</p>
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
        {user?.userType === 'brand'
          ? 'Browse creators and message them directly, or accept a creator from your campaign applicants to start a conversation.'
          : 'Browse brands and message them, or apply to campaigns — brands will reach out if they\'re interested.'}
      </p>
    </div>
  );

  const NoChatSelected = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
        <MessageSquare className="w-7 h-7 text-gray-600" />
      </div>
      <p className="text-white font-medium mb-2">Select a conversation</p>
      <p className="text-gray-500 text-sm">Choose someone from the list to start messaging</p>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full bg-black rounded-xl border border-gray-800 overflow-hidden" style={{ minHeight: '70vh' }}>

      {/* ── LEFT: Conversation list ── */}
      <div className={`
        flex-col border-r border-gray-800 bg-gray-950
        ${showList ? 'flex' : 'hidden'}
        md:flex md:w-72 lg:w-80 w-full flex-shrink-0
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex-shrink-0">
          <h2 className="text-white font-semibold mb-3">Messages</h2>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-black border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 text-gray-600 animate-spin" />
            </div>
          ) : filteredConvs.length === 0 ? (
            <EmptyConversations />
          ) : (
            filteredConvs.map(conv => (
              <ConvItem
                key={conv.user._id}
                conv={conv}
                isSelected={selectedUserId === conv.user._id}
                onClick={() => selectConversation(conv)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── RIGHT: Chat area ── */}
      <div className={`
        flex-1 flex flex-col
        ${!showList ? 'flex' : 'hidden'}
        md:flex
      `}>
        {!selectedUserId ? (
          <NoChatSelected />
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-800 bg-gray-950 flex-shrink-0">
              {/* Mobile back button */}
              <button
                onClick={() => setShowList(true)}
                className="md:hidden p-1.5 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <Avatar src={selectedUser?.avatar} name={selectedUser?.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{selectedUser?.name}</p>
                <p className="text-gray-500 text-xs capitalize">
                  {selectedUser?.userType === 'brand' ? 'Brand' : 'Creator'} · {selectedUser?.userName}
                </p>
              </div>
            </div>

            {/* Context banner */}
            <ContextBanner context={contextText} />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {loadingMsgs ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 text-gray-600 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-sm">No messages yet</p>
                  <p className="text-gray-600 text-xs mt-1">Say hello 👋</p>
                </div>
              ) : (
                grouped.map(({ day, msgs }) => (
                  <div key={day}>
                    <DaySep date={msgs[0].createdAt} />
                    {msgs.map(msg => (
                      <Bubble
                        key={msg._id}
                        msg={msg}
                        isMine={msg.sender === user?._id || msg.sender?._id === user?._id}
                      />
                    ))}
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="px-4 py-3 border-t border-gray-800 bg-gray-950 flex-shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    // Auto-resize
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message... (Enter to send)"
                  rows={1}
                  className="flex-1 bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gray-600 resize-none leading-relaxed"
                  style={{ minHeight: '42px', maxHeight: '120px' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="bg-white hover:bg-gray-100 disabled:opacity-30 text-black p-2.5 rounded-xl transition-colors flex-shrink-0"
                >
                  {sending
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                </button>
              </div>
              <p className="text-gray-700 text-xs mt-1.5 ml-1">Shift+Enter for new line</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}