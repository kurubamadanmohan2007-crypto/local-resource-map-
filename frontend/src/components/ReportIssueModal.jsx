import React, { useState } from 'react';
import { X, Flag, AlertCircle } from 'lucide-react';

const ISSUE_TYPES = [
  'Incorrect Address',
  'Closed / Does Not Exist',
  'Outdated Hours',
  'Broken Amenity / Equipment',
  'Hygiene / Cleanliness Issue',
  'Other'
];

export default function ReportIssueModal({ resource, isOpen, onClose, onSubmit, isSubmitting }) {
  const [issueType, setIssueType] = useState('Incorrect Address');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !resource) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a short description of the issue');
      return;
    }

    onSubmit(resource._id, {
      issueType,
      description: description.trim(),
      reportedBy: reportedBy.trim() || 'Community Resident'
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Flag size={20} color="#b91c1c" />
            <span>Report an Issue</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              marginBottom: '18px'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Reporting regarding facility:
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
              {resource.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#475569' }}>
              📍 {resource.address}, {resource.city}
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                fontSize: '0.85rem',
                marginBottom: '14px'
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nature of the Issue *</label>
            <select
              className="form-select"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              required
            >
              {ISSUE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Explanation *</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="Please explain what is incorrect or broken (e.g. 'The water fountain has no pressure', 'This clinic relocated to 2nd street', etc.)..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError('');
              }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Name or Contact (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Alex, Neighborhood Resident"
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
            />
          </div>

          <div className="modal-footer" style={{ margin: '16px -24px -24px -24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting Report...' : 'Submit Issue Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
