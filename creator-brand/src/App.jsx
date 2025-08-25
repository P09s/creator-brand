import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Add this
import useAuthStore from './store/authStore';
import Header from './component/header';
import Body from './component/body';
import Footer from './component/footer';
import ScrollRestoration from './component/ScrollRestoration';

function AppContent() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const location = useLocation();
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const shouldRenderHeader = !(
    location.pathname.startsWith('/org_dashboard') || location.pathname.startsWith('/influencer_dashboard')
  );
  const shouldRenderFooter = !(
    location.pathname.startsWith('/org_dashboard') || location.pathname.startsWith('/influencer_dashboard')
  );

  return (
    <div className="bg-black min-h-screen">
      {/* Add Toaster component */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#ffffff',
            border: '1px solid #374151',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '16px 20px',
          },
          // Custom animation styles
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      
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