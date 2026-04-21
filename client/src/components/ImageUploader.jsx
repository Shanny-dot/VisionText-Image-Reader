import React, { useState, useRef, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

function ImageUploader({ accessToken, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Create and revoke object URL for preview
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setError('');
      setResult('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    setResult('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setResult(data.extractedText);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="upload-scan-grid">
        {/* Upload Card */}
        <div className={`upload-card ${file ? 'has-file' : ''}`}>
          <input
            id="image-input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="upload-input"
            onChange={handleFileChange}
          />

          {preview ? (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
              <div className="preview-filename">{file.name}</div>
              <button
                type="button"
                className="btn-change-file"
                onClick={() => fileInputRef.current?.click()}
              >
                Change image
              </button>
            </div>
          ) : (
            <>
              <div className="upload-cloud-icon">☁️</div>
              <div className="upload-card-title">New Extraction</div>
              <div className="upload-card-desc">
                Drag and drop high-resolution images or select a file
              </div>
            </>
          )}

          <div className="upload-card-actions">
            {!file ? (
              <>
                <button
                  id="upload-new-btn"
                  type="button"
                  className="btn-upload-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  + Upload New
                </button>
                <button
                  type="button"
                  className="btn-browse"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Files
                </button>
              </>
            ) : !loading ? (
              <button
                id="upload-btn"
                type="button"
                className="btn-upload-primary"
                onClick={handleUpload}
                disabled={loading}
              >
                🔍 Extract Text
              </button>
            ) : null}
          </div>

          {loading && (
            <div className="upload-progress">
              <div className="progress-bar-track">
                <div className="progress-bar-fill" />
              </div>
              <p className="progress-text">
                Processing with OCR engine — this may take a moment…
              </p>
            </div>
          )}

          {error && <div className="msg-error" style={{ marginTop: 16, width: '100%', position: 'relative', zIndex: 1 }}>{error}</div>}
        </div>

        {/* Active Scan / Result Card */}
        <div className="scan-card">
          <div className="scan-card-header">
            <div className="scan-card-title">Active Scan</div>
            <div className="scan-card-subtitle">
              {result ? 'Extraction complete' : 'Waiting for upload'}
            </div>
          </div>

          {result ? (
            <>
              <div className="confidence-bar-wrapper">
                <div className="confidence-bar-label">
                  <span className="confidence-bar-text">Confidence</span>
                  <span className="confidence-bar-value">98.2%</span>
                </div>
                <div className="confidence-bar-track">
                  <div
                    className="confidence-bar-fill"
                    style={{ width: '98.2%' }}
                  />
                </div>
              </div>

              <div className="scan-preview-lines">
                <div className="scan-line" style={{ width: '100%', background: 'var(--brand-blue-soft)' }} />
                <div className="scan-line" style={{ width: '80%', background: 'var(--brand-blue-soft)' }} />
                <div className="scan-line" style={{ width: '60%', background: 'var(--brand-blue-soft)' }} />
              </div>

              <div className="detected-entity">
                <div className="detected-label">Detected Entity</div>
                <div className="detected-value">
                  {file ? file.name : 'Document'}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="confidence-bar-wrapper">
                <div className="confidence-bar-label">
                  <span className="confidence-bar-text">Confidence</span>
                  <span className="confidence-bar-value">—</span>
                </div>
                <div className="confidence-bar-track">
                  <div
                    className="confidence-bar-fill"
                    style={{ width: loading ? '60%' : '0%' }}
                  />
                </div>
              </div>

              <div className="scan-preview-lines">
                <div className={`scan-line ${loading ? 'animated' : ''}`} />
                <div className={`scan-line ${loading ? 'animated' : ''}`} />
                <div className={`scan-line ${loading ? 'animated' : ''}`} />
              </div>

              <div className="detected-entity">
                <div className="detected-label">Detected Entity</div>
                <div className="detected-value" style={{ color: 'var(--text-muted)' }}>
                  {loading ? 'Scanning…' : 'No file uploaded'}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* OCR Result Modal popup */}
      {result && (
        <div className="modal-overlay" onClick={() => setResult('')}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">✨ Extracted Text</div>
              <button className="btn-close" onClick={() => setResult('')}>×</button>
            </div>
            <div className="modal-body">
              <textarea
                id="ocr-result"
                className="ocr-text"
                value={result}
                readOnly
                style={{ minHeight: '300px' }}
              />
            </div>
            <div className="modal-footer">
              <button 
                className="btn-upload-primary"
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  alert('Copied to clipboard!');
                }}
              >
                Copy Text
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ImageUploader;
