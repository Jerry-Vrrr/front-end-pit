import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/pit-logo.png'; // Adjust the path if needed
import profile from '../assets/profile-icon.png'; // Adjust the path if needed
import AuthContext from '../context/AuthContext';


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { authToken, logout, userRole } = useContext(AuthContext); // Access authToken, logout, and userRole from AuthContext
  const navigate = useNavigate();

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" />
        </Link>
        <div className="nav-links">
          <Link to="/reports" className="nav-link">Reports</Link>
          {userRole === 'admin' && (
            <Link to="/forms" className="nav-link">Forms</Link>
          )}
          {authToken ? (
            <div className="profile-container">
              <div className="profile-icon" onClick={toggleDropdown}>
                <img src={profile} alt="Profile" />
              </div>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={handleLogout} className="dropdown-item">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
