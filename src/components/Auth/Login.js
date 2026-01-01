import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // simple client-side stub auth
    if (username.trim() === '' || password.trim() === '') {
      setError('Please enter username and password');
      return;
    }
    // In a real app, call your API here. We'll fake success.
    localStorage.setItem('dm_auth', '1');
    navigate('/' , { replace: true });
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
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
          />
        </label>
        <button type="submit" className="dm-login-btn">Sign in</button>
      </form>
    </div>
  );
}
