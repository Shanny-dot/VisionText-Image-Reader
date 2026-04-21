import React, { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import ImageUploader from '../components/ImageUploader';
import HistoryList from '../components/HistoryList';

function Dashboard() {
  const { session } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeView, setActiveView] = useState('overview');

  const handleUploadSuccess = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const userEmail = session?.user?.email || '';
  const userInitial = userEmail.charAt(0).toUpperCase();
  const userName = userEmail.split('@')[0];

  // Generate a time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">VisionText</div>
          <div className="sidebar-user">
            <div className="sidebar-avatar">{userInitial}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">Workspace</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            type="button" 
            className={`nav-item ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveView('overview')}
          >
            <span className="nav-icon">📊</span>
            Overview
          </button>
          <button 
            type="button" 
            className={`nav-item ${activeView === 'history' ? 'active' : ''}`}
            onClick={() => setActiveView('history')}
          >
            <span className="nav-icon">📄</span>
            Documents
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button type="button" className="sidebar-bottom-link">
            <span>❓</span> Help
          </button>
          <button
            id="logout-btn"
            type="button"
            className="sidebar-bottom-link logout"
            onClick={handleLogout}
          >
            <span>↪</span> Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-tabs">
            <button 
              type="button" 
              className={`top-tab ${activeView === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveView('overview')}
            >
              Dashboard
            </button>
            <button 
              type="button" 
              className={`top-tab ${activeView === 'history' ? 'active' : ''}`}
              onClick={() => setActiveView('history')}
            >
              History
            </button>
          </div>
          <div className="search-box">
            <span className="search-box-icon">🔍</span>
            <input type="text" placeholder="Search documents..." />
          </div>
        </div>

        {/* Page Body */}
        <div className="page-body">
          {/* Greeting */}
          <div className="greeting-section">
            <h1 className="greeting-title">
              {getGreeting()}, {userName}.
            </h1>
            <p className="greeting-subtitle">
              {activeView === 'overview' 
                ? 'Your smart OCR workspace is ready. Upload an image to extract text.'
                : 'View and manage your past text extractions.'}
            </p>
          </div>

          {activeView === 'overview' ? (
            <ImageUploader
              accessToken={session?.access_token}
              onUploadSuccess={handleUploadSuccess}
            />
          ) : (
            <HistoryList
              accessToken={session?.access_token}
              refreshKey={refreshKey}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
