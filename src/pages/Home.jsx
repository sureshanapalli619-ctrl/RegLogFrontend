import { useState, useEffect } from 'react';

function Home({ onNavigate }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('reglog_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('reglog_user');
    setUser(null);
    if (onNavigate) {
      onNavigate('/login');
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div className="home-card">
      <div className="home-hero">
        <div className="home-badge">🚀 Full Stack Authentication</div>
        <h1 className="home-title">
          {user ? `Welcome back, ${user.username}!` : 'Welcome to RegLog'}
        </h1>
        <p className="home-desc">
          {user
            ? `You are securely authenticated as ${user.email || user.username}. Connected directly to MySQL database.`
            : 'A complete React + Spring Boot + MySQL authentication system with JWT security.'}
        </p>

        <div className="home-actions">
          {user ? (
            <button onClick={handleLogout} className="btn-secondary">
              🚪 Log Out
            </button>
          ) : (
            <>
              <button
                onClick={() => onNavigate ? onNavigate('/login') : window.location.href = '/login'}
                className="btn-primary"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate ? onNavigate('/signup') : window.location.href = '/signup'}
                className="btn-outline"
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>

      <div className="status-grid">
        <div className="status-item">
          <span className="status-indicator active"></span>
          <div>
            <strong>Frontend</strong>
            <p>React + Vite (Port 5173)</p>
          </div>
        </div>
        <div className="status-item">
          <span className="status-indicator active"></span>
          <div>
            <strong>Backend API</strong>
            <p>Spring Boot (Port 8080)</p>
          </div>
        </div>
        <div className="status-item">
          <span className="status-indicator active"></span>
          <div>
            <strong>Database</strong>
            <p>MySQL (reglog_db:3306)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;