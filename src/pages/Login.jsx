import { useState } from 'react';

function Login({ onNavigate, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Invalid email or password.');
      }

      // Save user session
      const userSession = {
        username: data.username || formData.email.split('@')[0],
        email: formData.email,
        token: data.token || null,
      };
      localStorage.setItem('reglog_user', JSON.stringify(userSession));

      if (onLoginSuccess) {
        onLoginSuccess(userSession);
      }

      if (onNavigate) {
        onNavigate('/');
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials or server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-icon-badge">🔐</div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in with your registered account</p>
      </div>

      {error && <div className="alert-badge alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            name="email"
            type="email"
            placeholder="e.g. suresh@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <span className="spinner-text">Authenticating...</span>
          ) : (
            'Log In'
          )}
        </button>
      </form>

      <div className="auth-footer">
        Don&apos;t have an account yet?{' '}
        <a
          href="/signup"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('/signup');
            else window.location.href = '/signup';
          }}
        >
          Sign Up
        </a>
      </div>
    </div>
  );
}

export default Login;