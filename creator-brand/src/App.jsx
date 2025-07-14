import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './component/header';
import Body from './component/body';
import Footer from './component/footer';

function App() {
  return (
    <>
      <Router>
        <div className="font-satoshi">
          <Header />
        </div>
        <div className="font-satoshi">
          <Body />
        </div>
        <div className="font-satoshi">
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;