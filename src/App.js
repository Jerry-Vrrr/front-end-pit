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
  const { authToken } = useContext(AuthContext);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route exact path="/" element={authToken ? <Dashboard /> : <LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} /> {/* Add sign-up route */}
        <Route path="/client/:companyId" element={authToken ? <ClientDetail /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
