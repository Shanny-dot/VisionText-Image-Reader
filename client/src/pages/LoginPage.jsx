import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccess('Account created successfully! You are now logged in.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (login) => {
    setIsLogin(login);
    setError('');
    setSuccess('');
  };

  return (
    <div className="login-page">
      {/* ── Left Navy Panel ── */}
      <div className="login-left">
        <div className="login-decoration-arc" />
        <div className="login-decoration-arc-2" />

        <div className="left-top">
          <div className="left-brand">VisionText</div>
          <div className="left-version">Smart OCR Platform v2.0</div>
        </div>

        <div className="left-middle">
          <h1 className="left-headline">
            Transforming images
            <br />
            into <span className="highlight">textual
            <br />
            clarity.</span>
          </h1>
          <p className="left-description">
            VisionText uses advanced OCR technology to analyze and extract text from your documents with unparalleled accuracy.
          </p>
        </div>

        <div className="left-bottom">
          <div className="avatar-stack">
            <div className="avatar-dot">S</div>
            <div className="avatar-dot">M</div>
            <div className="avatar-dot">A</div>
          </div>
          <span className="left-social-proof">
            Joined by <strong>8k+</strong> digital creators
          </span>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="login-right">
        <div className="confidence-badge">
          <div className="confidence-info">
            <div className="confidence-label">Accuracy Score</div>
            <div className="confidence-value">99.8%</div>
          </div>
          <div className="confidence-icon">✓</div>
        </div>

        <div className="login-right-inner">
          {/* Tabs */}
          <div className="tab-group">
            <button
              id="login-tab"
              type="button"
              className={`tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => switchTab(true)}
            >
              Sign In
            </button>
            <button
              id="signup-tab"
              type="button"
              className={`tab-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => switchTab(false)}
            >
              Create Account
            </button>
          </div>

          {/* Heading */}
          <h2 className="form-heading">
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h2>
          <p className="form-subheading">
            {isLogin
              ? 'Access your workspace and continue extracting.'
              : 'Create your account and start extracting text.'}
          </p>

          {/* Divider */}
          <div className="or-divider">
            <span>Email Access</span>
          </div>

          {/* Messages */}
          {error && <div className="msg-error">{error}</div>}
          {success && <div className="msg-success">{success}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
              </div>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                {isLogin && (
                  <span className="form-link">Forgot Password?</span>
                )}
              </div>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>

            {isLogin && (
              <div className="checkbox-row">
                <input type="checkbox" id="stay-signed" />
                <label htmlFor="stay-signed">Stay signed in for 30 days</label>
              </div>
            )}

            <button
              id="auth-submit"
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading
                ? 'Please wait…'
                : isLogin
                ? 'Enter Workspace'
                : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <span>© 2025 VisionText OCR. Smart Extraction for Creators.</span>
          <div className="login-footer-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
