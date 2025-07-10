import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './component/header';
import Body from './component/body';
import Footer from './component/footer';

function App() {

  return (
    <>
      <Router>
        <div className='font-satoshi'><Header/></div>
        <div><Body/></div>
        <div><Footer/></div>
      </Router>
    </>
  )
}

export default App
