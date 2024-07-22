import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Reports from './pages/Reports'; // Create this page later
import Forms from './pages/Forms';     // Create this page later
import Navbar from './components/Navbar';

const RouterComponent = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/forms" element={<Forms />} />
      </Routes>
    </Router>
  );
};

export default RouterComponent;
