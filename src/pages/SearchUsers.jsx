import { useState, useEffect } from 'react';

function SearchUsers({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const fetchUsers = async (searchQuery = '') => {
    setLoading(true);
    setError('');
    try {
      const url = searchQuery.trim()
        ? `${API_BASE_URL}/api/users/search?query=${encodeURIComponent(searchQuery.trim())}`
        : `${API_BASE_URL}/api/users/search`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch users from database');
      }
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers('');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(query);
  };

  const handleClear = () => {
    setQuery('');
    fetchUsers('');
  };

  return (
    <div className="search-card">
      <div className="search-header">
        <div className="auth-icon-badge">🔍</div>
        <h1 className="auth-title">Search Users in MySQL</h1>
        <p className="auth-subtitle">
          Search registered accounts live from the database by name or email
        </p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Type a name (e.g. suresh) or email..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              fetchUsers(e.target.value);
            }}
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClear}
              title="Clear"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {error && <div className="alert-badge alert-error">{error}</div>}

      <div className="search-results-meta">
        <span>
          {loading ? 'Searching database...' : `Found ${users.length} registered user${users.length === 1 ? '' : 's'}`}
        </span>
      </div>

      <div className="users-list">
        {users.length === 0 && !loading && (
          <div className="empty-results">
            <p>No registered users found matching &quot;{query}&quot;.</p>
          </div>
        )}

        {users.map((u) => (
          <div key={u.id} className="user-item-card">
            <div className="user-avatar">
              {u.username ? u.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-info">
              <div className="user-name-row">
                <span className="user-name">{u.username}</span>
                <span className="user-id-badge">ID #{u.id}</span>
              </div>
              <span className="user-email">{u.email}</span>
            </div>
            <div className="user-actions">
              <button
                className="user-login-btn"
                onClick={() => onNavigate && onNavigate('/login')}
                title="Log In"
              >
                Sign In →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchUsers;
