import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getCategoryDetails } from '../utils/categoryIcons';
import { MapPin, Clock, ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';

// Create a custom category-colored marker icon
function createCustomIcon(category, isOutdated) {
  const config = getCategoryDetails(category);
  const color = isOutdated ? '#d97706' : config.color || '#059669';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34]
  });
}

// Helper component to auto-center map bounds when resources update
function MapBoundsUpdater({ resources }) {
  const map = useMap();

  useEffect(() => {
    if (!resources || resources.length === 0) return;

    const validCoords = resources
      .filter((r) => r.coordinates && !isNaN(r.coordinates.lat) && !isNaN(r.coordinates.lng))
      .map((r) => [r.coordinates.lat, r.coordinates.lng]);

    if (validCoords.length > 0) {
      try {
        const bounds = L.latLngBounds(validCoords);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      } catch (err) {
        // Fallback
      }
    }
  }, [resources, map]);

  return null;
}

export default function ResourceMap({ resources, onViewDetails, onVerify }) {
  // Center coordinates (default: New York area for sample data)
  const defaultCenter = [40.758896, -73.985130];

  return (
    <div className="map-view-container">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={false}
        className="map-container-leaflet"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsUpdater resources={resources} />

        {resources.map((resource) => {
          if (!resource.coordinates || isNaN(resource.coordinates.lat) || isNaN(resource.coordinates.lng)) {
            return null;
          }

          const isOutdated = resource.isPotentiallyOutdated;
          const customIcon = createCustomIcon(resource.category, isOutdated);

          return (
            <Marker
              key={resource._id}
              position={[resource.coordinates.lat, resource.coordinates.lng]}
              icon={customIcon}
            >
              <Popup className="resource-map-popup">
                <div style={{ minWidth: '220px', padding: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: '#e0f2fe',
                        color: '#0369a1'
                      }}
                    >
                      {resource.category}
                    </span>
                    {isOutdated ? (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#b45309',
                          background: '#fef3c7',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        ⚠️ Needs Verification
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#047857',
                          background: '#d1fae5',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                    {resource.name}
                  </h4>

                  <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#475569' }}>
                    📍 {resource.address}, {resource.city}
                  </p>

                  <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#64748b' }}>
                    🕒 {resource.openingHours}
                  </p>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => onViewDetails(resource)}
                      style={{
                        flex: 1,
                        background: '#0284c7',
                        color: 'white',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      View Details
                    </button>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${resource.coordinates.lat},${resource.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#f1f5f9',
                        color: '#334155',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      Maps ↗
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
