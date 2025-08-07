import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Landing from './landing';
import Organization from './organization';
import Org_dashboard from './Dashboard/org_dashboard';
import Influencer from './influencer';
import Explore from './explore';
import Pro from './pro';
import Influencer_dashboard from './Dashboard/influencer_dashboard';

function Body() {
  const location = useLocation();
  const navigate = useNavigate();

  // Reset scroll and clear hash for non-/explore routes
  useEffect(() => {
    if (location.pathname !== '/explore' && location.hash) {
      // Clear hash by navigating to the same pathname without hash
      navigate(location.pathname, { replace: true, state: {} });
    }
    if (location.pathname !== '/explore' || !location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname, location.hash, navigate]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/organization" element={<PageWrapper><Organization /></PageWrapper>} />
        <Route path="/org_dashboard" element={<PageWrapper><Org_dashboard /></PageWrapper>} />
        <Route path="/influencer_dashboard" element={<PageWrapper><Influencer_dashboard /></PageWrapper>} />
        <Route path="/influencer" element={<PageWrapper><Influencer /></PageWrapper>} />
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
      transition={{ duration: 0.3, ease: 'easeInOut' }} // Reduced duration for faster transition
    >
      {children}
    </motion.div>
  );
}

export default Body;