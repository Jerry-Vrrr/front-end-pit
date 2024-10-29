// src/components/Navbar.js

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/pit-logo.png';
import profile from '../assets/profile-icon.png';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Redirect to login if authToken is null (user is logged out)
  useEffect(() => {
    if (!authToken) {
      navigate('/');
    }
  }, [authToken, navigate]);

  const handleLogout = () => {
    logout();
    // Redirect to home as soon as logout occurs
    navigate('/');
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
          {authToken && (
            <div className="profile-icon">
              <img src={profile} alt="Profile" />
              <div className="profile-dropdown">
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
