import React, { useEffect, useState } from 'react';
import { getCategoryDetails } from '../utils/categoryIcons';
import { fetchReports } from '../services/api';
import {
  X,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Flag,
  ExternalLink,
  Phone,
  Info,
  Calendar,
  Check,
  Tag
} from 'lucide-react';

export default function ResourceDetailModal({
  resource,
  isOpen,
  onClose,
  onVerify,
  onReportIssue,
  isVerifying
}) {
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    if (isOpen && resource?._id) {
      setLoadingReports(true);
      fetchReports(resource._id)
        .then((res) => {
          setReports(res.data || []);
        })
        .catch(() => setReports([]))
        .finally(() => setLoadingReports(false));
    }
  }, [isOpen, resource?._id]);

  if (!isOpen || !resource) return null;

  const { icon: CategoryIcon, color, bgColor } = getCategoryDetails(resource.category);

  const daysSince = resource.daysSinceVerification !== undefined
    ? resource.daysSinceVerification
    : (resource.lastVerified ? Math.floor(Math.abs(Date.now() - new Date(resource.lastVerified).getTime()) / 86400000) : 999);

  const isOutdated = resource.isPotentiallyOutdated ?? (daysSince > 30);

  const formattedDate = resource.lastVerified
    ? new Date(resource.lastVerified).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Never';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: bgColor,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CategoryIcon size={18} color={color} />
            </span>
            <span>{resource.name}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Banner Photo */}
          <div
            style={{
              position: 'relative',
              height: '220px',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '20px'
            }}
          >
            <img
              src={resource.imageUrl || 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80'}
              alt={resource.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(15, 23, 42, 0.85)',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              {resource.category}
            </div>
          </div>

          {/* Verification Banner */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '10px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: isOutdated ? 'var(--warning-bg)' : 'var(--success-bg)',
              border: `1px solid ${isOutdated ? 'var(--warning-border)' : 'var(--success-border)'}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isOutdated ? (
                <AlertTriangle size={24} color="#b45309" />
              ) : (
                <ShieldCheck size={24} color="#047857" />
              )}
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: isOutdated ? '#b45309' : '#047857'
                  }}
                >
                  {isOutdated
                    ? `⚠️ Potentially Outdated: Not verified in ${daysSince} days`
                    : `✓ Verified Community Resource`}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Last verified: <strong>{formattedDate}</strong> &bull; Total community confirmations:{' '}
                  <strong>{resource.verificationCount || 1}</strong>
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => onVerify(resource._id)}
              disabled={isVerifying}
            >
              <CheckCircle size={14} />
              <span>Verify Now</span>
            </button>
          </div>

          {/* Info Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Address and Map link */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <MapPin size={20} color="#0284c7" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>LOCATION & ADDRESS</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
                  {resource.address}, {resource.city}
                </div>
                {resource.coordinates && (
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                    GPS: {resource.coordinates.lat.toFixed(5)}, {resource.coordinates.lng.toFixed(5)} &bull;{' '}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${resource.coordinates.lat},${resource.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'none' }}
                    >
                      Open in Google Maps ↗
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Opening Hours */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Clock size={20} color="#059669" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>OPENING HOURS</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
                  {resource.openingHours || '24/7 (Always Open)'}
                </div>
              </div>
            </div>

            {/* Access Notes */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Info size={20} color="#6366f1" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>ACCESS NOTES & GUIDELINES</div>
                <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
                  {resource.accessNotes || 'Publicly accessible to everyone without restrictions.'}
                </div>
              </div>
            </div>

            {/* Contact info if available */}
            {resource.contactPhone && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Phone size={20} color="#0891b2" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>CONTACT INFORMATION</div>
                  <div style={{ fontSize: '0.9rem', color: '#0f172a' }}>{resource.contactPhone}</div>
                </div>
              </div>
            )}

            {/* Amenities list */}
            {resource.amenities && resource.amenities.length > 0 && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
                  KEY AMENITIES & FEATURES
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {resource.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      style={{
                        background: '#f1f5f9',
                        border: '1px solid #e2e8f0',
                        color: '#1e293b',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Check size={12} color="#059669" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reported Issues Section */}
            <div
              style={{
                marginTop: '10px',
                paddingTop: '16px',
                borderTop: '1px solid #e2e8f0'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                  Community Feedback &amp; Reports ({reports.length})
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onReportIssue(resource)}
                  style={{ color: '#b91c1c' }}
                >
                  <Flag size={13} />
                  <span>Report an Issue</span>
                </button>
              </div>

              {reports.length === 0 ? (
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  No open issues reported for this resource. Information is in good standing.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {reports.map((rep) => (
                    <div
                      key={rep._id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, color: '#b91c1c' }}>{rep.issueType}</span>
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                          {new Date(rep.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ color: '#334155' }}>{rep.description}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                        Reported by: {rep.reportedBy || 'Resident'} &bull; Status: {rep.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onVerify(resource._id)}
            disabled={isVerifying}
          >
            <CheckCircle size={16} />
            <span>Confirm &amp; Verify Resource</span>
          </button>
        </div>
      </div>
    </div>
  );
}
