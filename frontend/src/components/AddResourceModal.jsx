import React, { useState } from 'react';
import { CATEGORIES, getCategoryDetails } from '../utils/categoryIcons';
import { X, Plus, MapPin, Navigation, CheckCircle2 } from 'lucide-react';

export default function AddResourceModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Drinking Water',
    address: '',
    city: '',
    lat: '40.7580',
    lng: '-73.9855',
    openingHours: '24/7 (Always Open)',
    accessNotes: 'Free and open to the general public.',
    amenities: '',
    contactPhone: '',
    imageUrl: '',
    submittedBy: ''
  });

  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            lat: pos.coords.latitude.toFixed(6),
            lng: pos.coords.longitude.toFixed(6)
          }));
        },
        (err) => {
          alert('Could not retrieve current location: ' + err.message);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setFormError('Please enter a resource name');
      return;
    }
    if (!formData.address.trim()) {
      setFormError('Please provide a street address');
      return;
    }
    if (!formData.city.trim()) {
      setFormError('Please provide a city or area name');
      return;
    }

    const payload = {
      ...formData,
      lat: parseFloat(formData.lat) || 40.758896,
      lng: parseFloat(formData.lng) || -73.985130,
      amenities: formData.amenities
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    };

    onSubmit(payload);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Plus size={20} color="#059669" />
            <span>Submit a Public Community Resource</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {formError && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                fontSize: '0.875rem',
                marginBottom: '16px'
              }}
            >
              {formError}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Resource Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g., Riverside Park Water Fountain"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Street Address *</label>
              <input
                type="text"
                name="address"
                className="form-input"
                placeholder="e.g., Corner of 5th Ave & Park Rd"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">City / Neighborhood Area *</label>
              <input
                type="text"
                name="city"
                className="form-input"
                placeholder="e.g., Downtown, Westside, Midtown"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Coordinates (Latitude &amp; Longitude)</label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0284c7',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Navigation size={12} /> Auto-fill GPS
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input
                  type="number"
                  step="any"
                  name="lat"
                  className="form-input"
                  placeholder="Latitude (e.g. 40.758)"
                  value={formData.lat}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  step="any"
                  name="lng"
                  className="form-input"
                  placeholder="Longitude (e.g. -73.985)"
                  value={formData.lng}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Opening Hours</label>
              <input
                type="text"
                name="openingHours"
                className="form-input"
                placeholder="e.g., 24/7 or 06:00 AM - 10:00 PM"
                value={formData.openingHours}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Access Notes &amp; Guidelines</label>
            <textarea
              name="accessNotes"
              className="form-textarea"
              rows="2"
              placeholder="e.g., Wheelchair ramp available, free entry, located next to the security desk..."
              value={formData.accessNotes}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Key Amenities (Comma-separated)</label>
            <input
              type="text"
              name="amenities"
              className="form-input"
              placeholder="e.g., Cold Water, Fast Charger, Wheelchair Ramp, Restroom"
              value={formData.amenities}
              onChange={handleChange}
            />
            <span className="form-help">Separate individual amenities with commas.</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Photo URL (Optional)</label>
              <input
                type="url"
                name="imageUrl"
                className="form-input"
                placeholder="https://... (Leave blank for category default)"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone / Helpdesk (Optional)</label>
              <input
                type="text"
                name="contactPhone"
                className="form-input"
                placeholder="e.g., +1 (555) 019-2831"
                value={formData.contactPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Your Name or Organization (Optional)</label>
            <input
              type="text"
              name="submittedBy"
              className="form-input"
              placeholder="e.g., Jane Doe, Community Volunteer"
              value={formData.submittedBy}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer" style={{ margin: '16px -24px -24px -24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Publish Community Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
