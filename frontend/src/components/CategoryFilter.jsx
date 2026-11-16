import React from 'react';
import { CATEGORIES, getCategoryDetails } from '../utils/categoryIcons';
import { Layers, AlertTriangle, ArrowUpDown, MapPin } from 'lucide-react';

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  selectedCity,
  onSelectCity,
  cities,
  needsVerification,
  onToggleNeedsVerification,
  sortBy,
  onSortChange,
  categoryCounts
}) {
  return (
    <div className="filter-section">
      <div className="filter-header">
        <div className="filter-title">
          <span>Categories & Community Filters</span>
        </div>

        <div className="filter-controls">
          {/* City Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={16} color="#0284c7" />
            <select
              className="select-dropdown"
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value)}
              aria-label="Filter by City or Area"
            >
              <option value="All">All Neighborhoods / Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={16} color="#059669" />
            <select
              className="select-dropdown"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort resources"
            >
              <option value="default">Sort: Recently Added</option>
              <option value="verified_recent">Sort: Most Recently Verified</option>
              <option value="verified_oldest">Sort: Needs Verification First</option>
              <option value="name">Sort: Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* Needs Verification Pill Toggle */}
          <button
            type="button"
            className={`verification-toggle-pill ${needsVerification ? 'active' : ''}`}
            onClick={onToggleNeedsVerification}
          >
            <AlertTriangle size={15} color={needsVerification ? '#b45309' : '#94a3b8'} />
            <span>Needs Verification (&gt; 30d)</span>
          </button>
        </div>
      </div>

      {/* Category Chips */}
      <div className="category-chips">
        <button
          className={`category-chip ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => onSelectCategory('All')}
        >
          <Layers size={16} />
          <span>All Resources</span>
          {categoryCounts?.total !== undefined && (
            <span className="category-chip-count">{categoryCounts.total}</span>
          )}
        </button>

        {CATEGORIES.map((cat) => {
          const { icon: Icon } = getCategoryDetails(cat);
          const count = categoryCounts?.[cat] || 0;
          return (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              <Icon size={16} />
              <span>{cat}</span>
              <span className="category-chip-count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
