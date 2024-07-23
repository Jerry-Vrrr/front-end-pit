import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ClientDetail from './components/ClientDetail';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route path="/client/:companyId" element={<ClientDetail />} />
      </Routes>
    </div>
  );
}

export default App;
