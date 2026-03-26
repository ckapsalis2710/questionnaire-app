import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../UI/Icon';
import './Header.css';

const Header = ({ saveStatus, user, hasQuestions }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  // Show header only on questionnaire page
  const isQuestionnairePage = location.pathname === '/questionnaire';
  if (!isQuestionnairePage) return null;

  const infoMessage = hasQuestions 
  ? "You cannot add more than 10 questions."
  : "The Questionnaire is empty. Click 'Add new question' to start.";

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/" className="logo">
            <div className="logo-circle">Q</div>
          </Link>

          <div className="info-icon-container">
            <Icon name="circle" className="outer-circle" />
          </div>
          
          <span className="info-message">{infoMessage}</span>
        </div>

        <div className="header-right">
          <div className="save-status">
            {saveStatus === 'saved' && (
              <span className="status-text saved">Saved</span>
            )}
            {saveStatus === 'saving' && (
              <span className="status-text saving">Saving…</span>
            )}
            {saveStatus === 'error' && (
              <span className="status-text error">Unable to Save</span>
            )}
          </div>

          {/* In case of user authedication implementation */}
          <div className="user-menu" onClick={() => setShowUserMenu(!showUserMenu)}>
            <Icon name="user" className="user-icon" />
            {showUserMenu && user && (
              <div className="user-dropdown">
                <button>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;