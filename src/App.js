import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Results from './components/Results.js';
import Home from './components/Home.js';
import ErrorPage from './components/ErrorPage.js';
import Info from './components/Info';




function App() {

  return (
    <>
      <Router>
        <Routes>
        <Route path='/' element={<><Home/></>} />
        <Route path="/Results" element={<><Results/></>} />
        <Route path='/Error' element={<><ErrorPage /></>} />
        <Route path='/Info' element={<><Info /></>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
