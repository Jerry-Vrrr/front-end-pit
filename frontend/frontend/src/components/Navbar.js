// frontend/src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/pit-logo.png'; // Adjust the path if needed
import profile from '../assets/profile-icon.png'; // Adjust the path if needed

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50); // Adjust the scroll threshold as needed
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" />
        </Link>
        <div className="nav-links">
          <Link to="/reports" className="nav-link">Reports</Link>
          <Link to="/forms" className="nav-link">Forms</Link>
          <div className="profile-icon">
            <img src={profile} alt="Logo" alt="Profile" /> {/* Adjust the path if needed */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
