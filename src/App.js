import React, { useContext } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ClientDetail from './components/ClientDetail';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm'; // Import SignUpForm
import { Route, Routes, Navigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';

function App() {
  const { authToken } = useContext(AuthContext); // Removed userRole since it's unused

  return (
    <div className="App">
      <Navbar />
      <Routes>
        {/* Redirect to dashboard or login based on auth status */}
        <Route exact path="/" element={authToken ? <Dashboard /> : <LoginForm />} />
        
        {/* Sign-up route */}
        <Route path="/signup" element={<SignUpForm />} /> 

        {/* Admin and client overview */}
        <Route path="/admin" element={authToken ? <Dashboard /> : <Navigate to="/" />} />

        {/* Client-specific detail page */}
        <Route path="/client/:companyId" element={authToken ? <ClientDetail /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
