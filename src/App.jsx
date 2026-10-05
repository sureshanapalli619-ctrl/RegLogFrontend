import { useState, useEffect } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import './App.css';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, '', to);
    setCurrentPath(to);
  };

  return (
    <div className="app-container">
      <nav className="app-navbar">
        <div className="nav-brand" onClick={() => navigate('/')}>
          <span className="brand-dot"></span> RegLog
        </div>
        <div className="nav-links">
          <button
            className={`nav-btn ${currentPath === '/' ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            Home
          </button>
          <button
            className={`nav-btn ${currentPath === '/login' ? 'active' : ''}`}
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button
            className={`nav-btn ${currentPath === '/signup' ? 'active' : ''}`}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
        </div>
      </nav>

      <main className="app-content">
        {currentPath === '/signup' && <Signup onNavigate={navigate} />}
        {currentPath === '/login' && <Login onNavigate={navigate} />}
        {currentPath !== '/signup' && currentPath !== '/login' && (
          <Home onNavigate={navigate} />
        )}
      </main>
    </div>
  );
}

export default App;