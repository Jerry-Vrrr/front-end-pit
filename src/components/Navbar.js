// src/components/Navbar.js

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/pit-logo.png'; // Adjust the path if needed
import profile from '../assets/profile-icon.png'; // Adjust the path if needed
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { authToken, logout } = useContext(AuthContext); // Access authToken and logout from AuthContext
  const navigate = useNavigate(); // For redirecting after logout
  const location = useLocation(); // Get the current route

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50); // Adjust the scroll threshold as needed
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" />
        </Link>
        <div className="nav-links">
          {location.pathname === '/reports' ? (
            <Link to="/" className="nav-link">Dashboard</Link>
          ) : (
            <Link to="/reports" className="nav-link">Reports</Link>
          )}
          {authToken ? (
            <>
              <div className="profile-icon">
                <img src={profile} alt="Profile" />
                <div className="profile-dropdown">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
