import React, { useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Header from './component/header';
import Body from './component/body';
import Footer from './component/footer';
import ScrollRestoration from './component/ScrollRestoration';

function AppContent() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const location = useLocation();

  // Hide header for dashboard routes
  const shouldRenderHeader = !(
    location.pathname.startsWith('/org_dashboard') || location.pathname.startsWith('/influencer_dashboard')
  );
  const shouldRenderFooter = !(
    location.pathname.startsWith('/org_dashboard') || location.pathname.startsWith('/influencer_dashboard')
  );

  return (
    <div className="bg-black min-h-screen">
      <div className="font-satoshi">
        {shouldRenderHeader && <Header setHeaderHeight={setHeaderHeight} />}
      </div>
      <ScrollRestoration />
      <div
        className="font-satoshi"
        style={{ paddingTop: shouldRenderHeader ? `${headerHeight}px` : '0px' }}
      >
        <Body />
      </div>
      <div className="font-satoshi">
        {shouldRenderFooter && <Footer />}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;