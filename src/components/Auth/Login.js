import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (username.trim() === '' || password.trim() === '') {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);

    try {
      const result = await login(username, password);
      
      if (result.success) {
        navigate('/', { replace: true });
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dm-login-root">
      <form className="dm-login-card" onSubmit={handleSubmit}>
        <h2>Sign in</h2>
        {error && <div className="dm-login-error">{error}</div>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your.username"
            autoFocus
            disabled={loading}
            maxLength={5}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            disabled={loading}
            maxLength={20}
          />
        </label>
        <button type="submit" className="dm-login-btn" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
