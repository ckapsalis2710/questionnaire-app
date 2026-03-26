import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import './App.css';

// Lazy load of components than are not necessary for initial render
const Home = lazy(() => import('./components/Home/Home'));
const Questionnaire = lazy(() => import('./components/Questionnaire/Questionnaire'));

// Loading component while chunks are loading
const LoadingFallback = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

// Logs to depict environment info
console.log('=== ENVIRONMENT INFO ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('========================');

function AppContent() {
  const [saveStatus, setSaveStatus] = useState('saved');
  const [user, setUser] = useState(null);
  const [hasQuestions, setHasQuestions] = useState(false);

  return (
    <div className="App">
      <Header saveStatus={saveStatus} user={user} hasQuestions={hasQuestions} />
      <main className="main-content">
        {/* Suspense wraps all lazy-loaded routes */}
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/questionnaire" 
              element={
                <Questionnaire 
                  onSaveStatusChange={setSaveStatus} 
                  onQuestionsChange={setHasQuestions} 
                />
              } 
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;