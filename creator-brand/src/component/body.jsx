import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './landing';
import Organization from './organization';
import Influencer from './influencer';
import Explore from './explore';
import Trending from './explore/Trending';
import Categories from './explore/Categories';
import TopInfluencers from './explore/TopInfluencers';
import Pro from './pro';

function Body() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/organization" element={<Organization />} />
      <Route path="/influencer" element={<Influencer />} />
      <Route path="/explore" element={<Explore />}>
        <Route path="trending" element={<Trending />} />
        <Route path="categories" element={<Categories />} />
        <Route path="top-influencers" element={<TopInfluencers />} />
      </Route>
      <Route path="/pro" element={<Pro />} />
    </Routes>
  );
}

export default Body;
