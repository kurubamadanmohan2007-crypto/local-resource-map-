import React from 'react';
import ResourceCard from './ResourceCard';
import { SearchX, PlusCircle } from 'lucide-react';

export default function ResourceList({
  resources,
  isLoading,
  onViewDetails,
  onVerify,
  onReportIssue,
  isVerifying,
  onOpenAddModal,
  onResetFilters
}) {
  if (isLoading) {
    return (
      <div className="resource-grid">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="resource-card"
            style={{ minHeight: '360px', opacity: 0.6, background: '#f8fafc' }}
          >
            <div style={{ height: '180px', background: '#e2e8f0' }} />
            <div style={{ padding: '20px' }}>
              <div style={{ height: '24px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '12px' }} />
              <div style={{ height: '16px', background: '#e2e8f0', borderRadius: '4px', width: '70%', marginBottom: '8px' }} />
              <div style={{ height: '16px', background: '#e2e8f0', borderRadius: '4px', width: '50%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <SearchX size={32} />
        </div>
        <h3 className="empty-state-title">No resources match your search or filters</h3>
        <p className="empty-state-subtitle">
          Try clearing search filters or be the first in your community to add this facility to our directory.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onResetFilters}>
            Clear All Filters
          </button>
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <PlusCircle size={16} />
            <span>Add New Resource</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="resource-grid">
      {resources.map((resource) => (
        <ResourceCard
          key={resource._id}
          resource={resource}
          onViewDetails={onViewDetails}
          onVerify={onVerify}
          onReportIssue={onReportIssue}
          isVerifying={isVerifying}
        />
      ))}
    </div>
  );
}
