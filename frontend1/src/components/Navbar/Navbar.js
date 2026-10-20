
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

import EmblemOfIndia from '../../assets/2.jpg';
import SealOfMaharashtra from '../../assets/4.png';
import AmritMahotsavLogo from '../../assets/3.jpg';
import GramConnectLogo from '../../assets/images.png';

const translations = {
  en: {
    department: 'Rural Development & Panchayat Raj Department',
    state: 'Government Of Uttar Pradesh',
    portal: 'Digital Gram Panchayat Portal',
    home: 'Home',
    services: 'Services',
    schemes: 'Schemes',
    notice: 'Notice Board',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    loginAlert: 'Please login to access this section.',
  },
  hi: {
    department: 'ग्राम विकास एवं पंचायती राज विभाग',
    state: 'उत्तर प्रदेश सरकार',
    portal: 'डिजिटल ग्राम पंचायत पोर्टल',
    home: 'होम',
    services: 'सेवाएँ',
    schemes: 'योजनाएँ',
    notice: 'सूचना पट्ट',
    contact: 'संपर्क करें',
    login: 'लॉगिन',
    register: 'पंजीकरण',
    logout: 'लॉगआउट',
    loginAlert: 'इस अनुभाग को खोलने के लिए कृपया लॉगिन करें।',
  },
  mr: {
    department: 'ग्रामविकास आणि पंचायत राज विभाग',
    state: 'उत्तर प्रदेश सरकार',
    portal: 'डिजिटल ग्रामपंचायत पोर्टल',
    home: 'मुख्यपृष्ठ',
    services: 'सेवा',
    schemes: 'योजना',
    notice: 'सूचना फलक',
    contact: 'संपर्क',
    login: 'लॉगिन',
    register: 'नोंदणी',
    logout: 'लॉगआउट',
    loginAlert: 'या विभागात प्रवेश करण्यासाठी कृपया लॉगिन करा.',
  },
};

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [language, setLanguage] = useState('en');
  const t = translations[language];

  const handleProtectedClick = (path) => {
    if (!token) {
      alert(t.loginAlert);
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('https://gramconnect-6d18.onrender.com/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <div className="navbar-container">
      <div className="government-header">
        <div className="header-content">
          <div className="left-logo">
            <img
              src={EmblemOfIndia}
              alt="Government Emblem"
              className="govt-logo"
            />
          </div>

          <div className="header-text">
            <div className="hindi-text">
              ग्राम विकास एवं पंचायती राज विभाग
            </div>
            <div className="english-title">
              <strong>{t.department}</strong>
            </div>
            <div className="state-name">{t.state}</div>
          </div>

          <div className="right-logo">
            <img
              src={SealOfMaharashtra}
              alt="Government Seal"
              className="govt-logo"
            />
            <img
              src={AmritMahotsavLogo}
              alt="Azadi Ka Amrit Mahotsav"
              className="amrit-logo"
            />
          </div>
        </div>
      </div>

      <div className="main-navbar">
        <div className="navbar-brand">
          <div className="logo-icon">
            <img
              src={GramConnectLogo}
              alt="GramConnect Logo"
              width="40"
              height="40"
            />
          </div>

          <div className="logo-text">
            <h1>GramConnect</h1>
            <p>{t.portal}</p>
          </div>
        </div>

        <div className="navbar-center">
          <div className="navbar-links">
            <Link to="/">{t.home}</Link>

            <span
              className="clickable-link"
              onClick={() => handleProtectedClick('/services')}
            >
              {t.services}
            </span>

            <span
              className="clickable-link"
              onClick={() => handleProtectedClick('/schemes')}
            >
              {t.schemes}
            </span>

            <span
              className="clickable-link"
              onClick={() => handleProtectedClick('/notice-board')}
            >
              {t.notice}
            </span>

            <span
              className="clickable-link"
              onClick={() => handleProtectedClick('/contact')}
            >
              {t.contact}
            </span>
          </div>
        </div>

        <div className="navbar-actions">
          <select
            className="language-selector"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Select language"
          >
            <option value="en">English</option>
           
          </select>

          <div className="auth-buttons">
            {!token ? (
              <>
                <button
                  className="login-btn"
                  onClick={() => navigate('/login')}
                >
                  {t.login}
                </button>

                <button
                  className="register-btn"
                  onClick={() => navigate('/register')}
                >
                  {t.register}
                </button>
              </>
            ) : (
              <button className="logout-btn" onClick={handleLogout}>
                {t.logout}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
