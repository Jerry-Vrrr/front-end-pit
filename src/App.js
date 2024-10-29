import React, { useContext } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ClientDetail from './components/ClientDetail';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm'; // Import SignUpForm
import { Route, Routes, Navigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import Reports from './components/Reports';


function App() {
  const { authToken } = useContext(AuthContext); // Removed userRole since it's unused

  return (
    <div className="App">
      <Navbar />
      <Routes>
  {/* Change this to redirect to /admin */}
  <Route exact path="/" element={authToken ? <Navigate to="/admin" /> : <LoginForm />} />
  
  {/* Admin and dashboard route */}
  <Route path="/admin" element={authToken ? <Dashboard /> : <Navigate to="/" />} />

  {/* Client-specific detail page */}
  <Route path="/client/:companyId" element={authToken ? <ClientDetail /> : <Navigate to="/" />} />
  <Route path="/reports" element={<Reports />} />
  {/* Sign-up route */}
  <Route path="/signup" element={<SignUpForm />} />
</Routes>
    </div>
  );
}

export default App;
