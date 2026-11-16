import React from 'react';
import { getCategoryDetails } from '../utils/categoryIcons';
import {
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Flag,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function ResourceCard({
  resource,
  onViewDetails,
  onVerify,
  onReportIssue,
  isVerifying
}) {
  const { icon: CategoryIcon, color, bgColor } = getCategoryDetails(resource.category);

  const daysSince = resource.daysSinceVerification !== undefined
    ? resource.daysSinceVerification
    : (resource.lastVerified ? Math.floor(Math.abs(Date.now() - new Date(resource.lastVerified).getTime()) / 86400000) : 999);

  const isOutdated = resource.isPotentiallyOutdated ?? (daysSince > 30);

  return (
    <article className="resource-card">
      {/* Card Image Banner */}
      <div className="resource-card-image-wrapper">
        <img
          src={resource.imageUrl || 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80'}
          alt={resource.name}
          className="resource-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Category Pill Badge */}
        <div className="category-tag-badge">
          <CategoryIcon size={14} color={color} />
          <span>{resource.category}</span>
        </div>

        {/* Verification Status Pill */}
        {isOutdated ? (
          <div className="verification-status-badge outdated" title={`Not verified for ${daysSince} days`}>
            <AlertTriangle size={13} />
            <span>Needs Verification ({daysSince}d)</span>
          </div>
        ) : (
          <div className="verification-status-badge verified" title={`Verified ${daysSince === 0 ? 'today' : `${daysSince}d ago`}`}>
            <ShieldCheck size={13} />
            <span>Verified {daysSince === 0 ? 'Today' : `${daysSince}d ago`}</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="resource-card-body">
        <h3 className="resource-card-title">{resource.name}</h3>

        <div className="resource-card-meta">
          <div className="meta-item">
            <MapPin size={16} className="meta-icon" />
            <span>
              <strong>{resource.city}</strong> &bull; {resource.address}
            </span>
          </div>

          <div className="meta-item">
            <Clock size={16} className="meta-icon" />
            <span>{resource.openingHours || '24/7 (Always Open)'}</span>
          </div>
        </div>

        {/* Amenities Chips */}
        {resource.amenities && resource.amenities.length > 0 && (
          <div className="amenities-pills">
            {resource.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="amenity-pill">
                {amenity}
              </span>
            ))}
            {resource.amenities.length > 3 && (
              <span className="amenity-pill" style={{ color: 'var(--primary-blue-dark)' }}>
                +{resource.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="resource-card-footer">
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
              onClick={() => onViewDetails(resource)}
            >
              <span>Details</span>
              <ChevronRight size={14} />
            </button>

            <button
              className={`btn btn-sm ${isOutdated ? 'btn-primary' : 'btn-outline-green'}`}
              onClick={() => onVerify(resource._id)}
              disabled={isVerifying}
              title="Confirm that this resource is currently accurate and available"
            >
              <CheckCircle size={14} />
              <span>Verify</span>
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onReportIssue(resource)}
              title="Report outdated info, closure or issue"
              style={{ padding: '6px 10px', color: '#b91c1c' }}
            >
              <Flag size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
