import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Landing from './landing';
import Organization from './organization';
import Influencer from './influencer';
import Explore from './explore';
import HowItWorks from './explore/HowItWorks';
import WhatCanBePromoted from './explore/WhatCanBePromoted';
import Pro from './pro';
import GettingStarted from './explore/GettingStarted';
import CampaignTemplate from './explore/CampaignTemplate';

function Body() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/organization" element={<PageWrapper><Organization /></PageWrapper>} />
        <Route path="/influencer" element={<PageWrapper><Influencer /></PageWrapper>} />
        
        <Route path="/explore" element={<PageWrapper><Explore /></PageWrapper>}>
          <Route path="getting-started" element={<PageWrapper><GettingStarted /></PageWrapper>} />
          <Route path="how-it-works" element={<PageWrapper><HowItWorks /></PageWrapper>} />
          <Route path="what-can-be-promoted" element={<PageWrapper><WhatCanBePromoted /></PageWrapper>} />
          <Route path="campaign-template" element={<PageWrapper><CampaignTemplate /></PageWrapper>} />
        </Route>

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
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

export default Body;
