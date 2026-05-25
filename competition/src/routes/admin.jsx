import React, { useEffect, useState, useCallback } from 'react';
import { fetchAllRegistrations, fetchCompetitions } from '../api/client';

  // State for competition map
  // const [competitionsMap, setCompetitionsMap] = useState({});

  // // Update loadData to fetch competitions as well
  // async function loadData() {
  //   setLoading(true);
  //   try {
  //     const [regs, comps] = await Promise.all([fetchAllRegistrations(), fetchCompetitions()]);
  //     setRegistrations(regs);
  //     const map = {};
  //     comps.forEach((c) => {
  //       map[c.id] = c.title;
  //     });
  //     setCompetitionsMap(map);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }


const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin@2026';
const AUTH_KEY = 'admin_authenticated';

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [shakeForm, setShakeForm] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [competitionsMap, setCompetitionsMap] = useState({});

  // Filter state
  const [emailFilter, setEmailFilter] = useState('');
  const [competitionFilter, setCompetitionFilter] = useState('');

  // Apply filters to registrations
  const filteredRegistrations = registrations.filter(reg => {
    const emailMatch = reg.email?.toLowerCase().includes(emailFilter.toLowerCase());
    const competitionName = competitionsMap[reg.competition_name] || reg.competition_name || '';
    const compMatch = competitionName.toLowerCase().includes(competitionFilter.toLowerCase());
    return emailMatch && compMatch;
  });

  const handleLogin = useCallback((e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    // Simulate a brief network delay for realism
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem(AUTH_KEY, 'true');
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid username or password. Please try again.');
        setShakeForm(true);
        setTimeout(() => setShakeForm(false), 600);
      }
      setLoginLoading(false);
    }, 800);
  }, [username, password]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setRegistrations([]);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadData() {
      setLoading(true);
      try {
        const [regs, comps] = await Promise.all([fetchAllRegistrations(), fetchCompetitions()]);
        setRegistrations(regs);
        const map = {};
        comps.forEach((c) => {
          map[c.id] = c.title;
        });
        setCompetitionsMap(map);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isAuthenticated]);

  // ─── LOGIN SCREEN ─────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-backdrop">
          <div className="admin-login-glow admin-login-glow--1"></div>
          <div className="admin-login-glow admin-login-glow--2"></div>
        </div>

        <div className={`admin-login-card ${shakeForm ? 'admin-login-card--shake' : ''}`}>
          <div className="admin-login-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm0 10a2 2 0 0 1 1 3.732V19a1 1 0 1 1-2 0v-1.268A2 2 0 0 1 12 14z" fill="url(#lockGradient)"/>
              <defs>
                <linearGradient id="lockGradient" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f472b6"/>
                  <stop offset="1" stopColor="#c084fc"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h1 className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-subtitle">Enter your credentials to access the dashboard</p>

          {loginError && (
            <div className="admin-login-error">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zM8 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              <span>{loginError}</span>
            </div>
          )}

          <form className="admin-login-form" onSubmit={handleLogin}>
            <div className="admin-input-group">
              <label htmlFor="admin-username">Username</label>
              <div className="admin-input-wrapper">
                <svg className="admin-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  id="admin-username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="admin-input-group">
              <label htmlFor="admin-password">Password</label>
              <div className="admin-input-wrapper">
                <svg className="admin-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="admin-login-btn"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <span className="admin-login-spinner"></span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="admin-login-footer-text">
            This area is restricted to authorized personnel only.
          </p>
        </div>
      </div>
    );
  }

  // ─── AUTHENTICATED DASHBOARD ──────────────────────────
  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div className="admin-dashboard-header-left">
          <h1 className="admin-dashboard-title">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px', verticalAlign: 'middle' }}>
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Registered Participants
          </h1>
          <span className="admin-dashboard-badge">
            {registrations.length} Total
          </span>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>

      {loading && (
        <div className="admin-loading">
          <span className="admin-login-spinner admin-login-spinner--lg"></span>
          <p>Loading registrations...</p>
        </div>
      )}

      {error && (
        <div className="admin-error-banner">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zM8 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
          <span>Error: {error}</span>
        </div>
      )}

      {/* Filter controls */}
      <div className="admin-filter-bar" style={{display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap'}}>
        <input
          type="text"
          placeholder="Filter by email..."
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="admin-filter-input"
          style={{flex: '1 1 200px', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)'}}
        />
        <input
          type="text"
          placeholder="Filter by competition..."
          value={competitionFilter}
          onChange={(e) => setCompetitionFilter(e.target.value)}
          className="admin-filter-input"
          style={{flex: '1 1 200px', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)'}}
        />
      </div>

      {!loading && !error && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Competition</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="admin-table-empty">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.4, marginBottom: '8px'}}>
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                      <polyline points="13 2 13 9 20 9"/>
                    </svg>
                    No registrations match the filters.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg, index) => (
                  <tr key={reg.registration_id} style={{ animationDelay: `${index * 0.04}s` }}>
                    <td className="admin-cell-id">#{reg.registration_id}</td>
                    <td className="admin-cell-name">{reg.first_name} {reg.last_name}</td>
                    <td>{reg.email}</td>
                    <td>{reg.phno}</td>
                    <td>{reg.address}</td>
                    <td>
                      <span className="admin-comp-tag">{competitionsMap[reg.competition_name] || reg.competition_name}</span>
                    </td>
                    <td>{new Date(reg.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
