import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './landing';
import Organization from './organization';
import Influencer from './influencer';
import Explore from './explore';
import Pro from './pro';

function Body() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/organization" element={<Organization />} />
      <Route path="/influencer" element={<Influencer />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/pro" element={<Pro />} />
    </Routes>
  );
}

export default Body;
