import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ProtectedRoute from './ProtectedRoute'; // Adjust path

import Landing from './landing';
import Organization from './organization';
import Org_dashboard from './org/org_dashboard';
import Influencer from './influencer';
import Explore from './explore';
import Pro from './pro';
import Influencer_dashboard from './influencer/influencer_dashboard';
import BrowseCampaign from './influencer/BrowseCampaign';

function Body() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== '/explore' && location.hash) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    if (location.pathname !== '/explore' || !location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname, location.hash, navigate]);

  const baseKey = location.pathname.split('/')[1] || '/';

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={baseKey}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/organization" element={<PageWrapper><Organization /></PageWrapper>} />
        <Route 
          path="/org_dashboard/*" 
          element={
            <ProtectedRoute requiredUserType="brand">
              <PageWrapper><Org_dashboard /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route path="/influencer" element={<PageWrapper><Influencer /></PageWrapper>} />
        <Route 
          path="/influencer_dashboard/*" 
          element={
            <ProtectedRoute requiredUserType="influencer">
              <PageWrapper><Influencer_dashboard /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/BrowseCampaign" 
          element={
            <ProtectedRoute requiredUserType="influencer">
              <PageWrapper><BrowseCampaign /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route path="/explore" element={<PageWrapper><Explore /></PageWrapper>} />
        <Route path="/pro" element={<PageWrapper><Pro /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

export default Body;