import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="welcome-card">
        <h1 className="welcome-title">My Questionnaire App</h1>
        <p className="welcome-message">
          Welcome to My Questionnaire App. An efficient way to create your own 
          questionnaire just in a few steps.
        </p>
        <button 
          className="create-button" 
          onClick={() => navigate('/questionnaire')}
        >
          Create my questionnaire
        </button>
      </div>
    </div>
  );
};

export default Home;