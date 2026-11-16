import React from 'react';
import { Search, X, ShieldCheck } from 'lucide-react';

export default function HeroBanner({ searchTerm, onSearchChange, onClearSearch }) {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-pill">
          <ShieldCheck size={16} />
          <span>Verified Local Community Resources</span>
        </div>

        <h1 className="hero-title">
          Discover Essential Public Resources <br />
          <span className="gradient-text">Right Around Your Neighborhood</span>
        </h1>

        <p className="hero-subtitle">
          Find public drinking water taps, solar phone charging stations, emergency shelters,
          clean restrooms, healthcare clinics, and community facilities near you with verified data.
        </p>

        <div className="search-bar-container">
          <div className="search-bar-wrapper">
            <Search className="search-icon" size={22} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by facility name, address, neighborhood, or amenities (e.g., 'solar', 'downtown', 'water')..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                className="search-clear-btn"
                onClick={onClearSearch}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
