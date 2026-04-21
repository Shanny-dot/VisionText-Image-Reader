import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

// Gradient backgrounds for history card thumbnails
const gradients = [
  'linear-gradient(135deg, #fde8d0 0%, #f5c89a 100%)',
  'linear-gradient(135deg, #d0e8fd 0%, #9ac5f5 100%)',
  'linear-gradient(135deg, #e8d0fd 0%, #c49af5 100%)',
  'linear-gradient(135deg, #d0fde8 0%, #9af5c8 100%)',
  'linear-gradient(135deg, #fdd0d0 0%, #f59a9a 100%)',
  'linear-gradient(135deg, #f5f0d0 0%, #e8d98a 100%)',
];

// Icons for thumbnails
const thumbIcons = ['📄', '🏢', '📋', '📑', '🧾', '📝'];

function HistoryList({ accessToken, refreshKey }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_URL}/api/history`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch history');
        }

        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchHistory();
    }
  }, [accessToken, refreshKey]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Generate a category label from extracted text
  const getCategory = (text) => {
    if (!text) return 'UNCATEGORIZED';
    const lower = text.toLowerCase();
    if (lower.includes('invoice') || lower.includes('amount') || lower.includes('total'))
      return 'FINANCIAL';
    if (lower.includes('agreement') || lower.includes('contract') || lower.includes('terms'))
      return 'LEGAL';
    if (lower.includes('report') || lower.includes('analysis') || lower.includes('data'))
      return 'REPORTS';
    if (lower.includes('name') || lower.includes('address') || lower.includes('phone'))
      return 'PERSONAL';
    return 'DOCUMENT';
  };

  return (
    <div>
      {/* Section Header */}
      <div className="history-section-header">
        <h2 className="history-section-title">Recent Extractions</h2>
        {history.length > 0 && (
          <button type="button" className="history-view-all">
            View Full History →
          </button>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div className="spinner" />
        </div>
      )}

      {error && <div className="msg-error">{error}</div>}

      {!loading && !error && history.length === 0 && (
        <div className="history-grid">
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <p className="empty-title">No extractions yet</p>
            <p className="empty-subtitle">
              Upload an image to get started with your first extraction
            </p>
          </div>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="history-grid">
          {history.map((item, index) => (
            <div 
              key={item.id} 
              className="history-card" 
              onClick={() => setSelectedItem(item)}
              style={{ cursor: 'pointer' }}
            >
              <div
                className="history-card-thumb"
                style={{ background: gradients[index % gradients.length] }}
              >
                <span className="thumb-icon">
                  {thumbIcons[index % thumbIcons.length]}
                </span>
                <div
                  className={`history-card-status ${
                    item.extracted_text ? 'status-success' : 'status-error'
                  }`}
                >
                  {item.extracted_text ? '✓' : '!'}
                </div>
              </div>
              <div className="history-card-body">
                <div className="history-card-category">
                  {getCategory(item.extracted_text)}
                </div>
                <div className="history-card-text">
                  {item.extracted_text || '(No text extracted)'}
                </div>
                <div className="history-card-date">
                  {formatDate(item.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History Detail Modal popup */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {getCategory(selectedItem.extracted_text)} — {formatDate(selectedItem.created_at)}
              </div>
              <button className="btn-close" onClick={() => setSelectedItem(null)}>×</button>
            </div>
            <div className="modal-body">
              <textarea
                className="ocr-text"
                value={selectedItem.extracted_text}
                readOnly
                style={{ minHeight: '300px' }}
              />
            </div>
            <div className="modal-footer">
              <button 
                className="btn-upload-primary"
                onClick={() => {
                  navigator.clipboard.writeText(selectedItem.extracted_text);
                  alert('Copied to clipboard!');
                }}
              >
                Copy Text
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryList;
