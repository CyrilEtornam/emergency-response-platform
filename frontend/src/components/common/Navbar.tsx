import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  if (!accessToken) {
    return null; // Don't show navbar if not logged in
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Emergency Response Platform</Link>
      </div>
      <ul className="navbar-nav">
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/incidents">Incidents</Link>
        </li>
        <li>
          <Link to="/users">User Management</Link>
        </li>
      </ul>
      <div className="navbar-actions">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;