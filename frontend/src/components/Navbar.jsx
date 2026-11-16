import React from 'react';
import { MapPin, Plus, RefreshCw, Database } from 'lucide-react';

export default function Navbar({ onOpenAddModal, onResetData, isSeeding, stats }) {
  return (
    <header className="navbar">
      <div className="container navbar-container">
        <a href="#" className="nav-brand">
          <div className="brand-icon-wrapper">
            <MapPin size={24} />
          </div>
          <div>
            <div style={{ lineHeight: 1.15 }}>Local Resource Map</div>
            <span className="brand-text-subtitle">Community Resource Directory</span>
          </div>
        </a>

        <div className="nav-actions">
          {stats?.storageMode && (
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#0369a1',
                background: '#e0f2fe',
                padding: '4px 10px',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Current active database store"
            >
              <Database size={13} /> {stats.storageMode}
            </span>
          )}

          <button
            className="btn btn-secondary btn-sm"
            onClick={onResetData}
            disabled={isSeeding}
            title="Reload initial realistic sample community data"
          >
            <RefreshCw size={14} className={isSeeding ? 'animate-spin' : ''} />
            <span>{isSeeding ? 'Reloading...' : 'Reset Sample Data'}</span>
          </button>

          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <Plus size={18} />
            <span>Submit Resource</span>
          </button>
        </div>
      </div>
    </header>
  );
}
