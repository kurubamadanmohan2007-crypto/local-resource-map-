import React from 'react';
import { Layers, ShieldCheck, AlertTriangle, MessageSquareWarning } from 'lucide-react';

export default function StatsSection({ stats, onFilterOutdated, isOutdatedFiltered }) {
  if (!stats) return null;

  return (
    <div className="stats-strip">
      <div className="stat-card">
        <div className="stat-icon blue">
          <Layers size={22} />
        </div>
        <div>
          <div className="stat-number">{stats.totalResources || 0}</div>
          <div className="stat-label">Active Directory Resources</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon green">
          <ShieldCheck size={22} />
        </div>
        <div>
          <div className="stat-number">{stats.verifiedRecentlyCount || 0}</div>
          <div className="stat-label">Verified (Last 30 Days)</div>
        </div>
      </div>

      <div
        className="stat-card"
        style={{ cursor: 'pointer', border: isOutdatedFiltered ? '2px solid #f59e0b' : undefined }}
        onClick={onFilterOutdated}
        title="Click to toggle filtering resources that need verification"
      >
        <div className="stat-icon amber">
          <AlertTriangle size={22} />
        </div>
        <div>
          <div className="stat-number" style={{ color: '#b45309' }}>
            {stats.outdatedCount || 0}
          </div>
          <div className="stat-label">
            {isOutdatedFiltered ? 'Showing: Needs Verification' : 'Needs Verification (> 30d)'}
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon purple">
          <MessageSquareWarning size={22} />
        </div>
        <div>
          <div className="stat-number">{stats.totalReports || 0}</div>
          <div className="stat-label">Community Feedback Reports</div>
        </div>
      </div>
    </div>
  );
}
