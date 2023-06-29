import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Results from './components/Results.js';
import Home from './components/Home.js';
import ErrorPage from './components/ErrorPage.js';
import Info from './components/Info';


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const handleTitleChange = () => {
      const currentPage = location.pathname;
      let title = '';

      if (currentPage === '/Results') {
        title = 'Results';
      } else if (currentPage === '/') {
        title = 'Home';
      } else if (currentPage === '/Error') {
        title = 'Error';
      } else if (currentPage === '/Info') {
        title = 'Info';
      } else {
        title = 'RxLookup';
      }

      document.title = title;
    };

    handleTitleChange();

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('popstate', handleTitleChange);
    };
  }, [location]);

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/Results" element={<Results />} />
        <Route path='/Error' element={<ErrorPage />} />
        <Route path='/Info' element={<Info />} />
      </Routes>
    </>
  );
}

export default App;
