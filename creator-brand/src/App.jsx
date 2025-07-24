import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './component/header';
import Body from './component/body';
import Footer from './component/footer';
import ScrollRestoration from './component/ScrollRestoration';

function App() {
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <Router>
      <div className="bg-black min-h-screen">
        <div className="font-satoshi">
          <Header setHeaderHeight={setHeaderHeight} />
        </div>
        <ScrollRestoration />
        <div className="font-satoshi" style={{ paddingTop: `${headerHeight}px` }}>
          <Body />
        </div>
        <div className="font-satoshi">
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;