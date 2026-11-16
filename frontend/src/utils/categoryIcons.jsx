import React from 'react';
import {
  Droplet,
  Zap,
  Home,
  DoorClosed,
  HeartPulse,
  Users,
  Compass
} from 'lucide-react';

export const CATEGORIES = [
  'Drinking Water',
  'Charging Point',
  'Public Shelter',
  'Public Toilet',
  'Hospital & Clinic',
  'Community Facility'
];

export const CATEGORY_CONFIG = {
  'Drinking Water': {
    icon: Droplet,
    color: '#0284c7', // Sky blue
    bgColor: '#e0f2fe',
    badgeClass: 'badge-water',
    description: 'Clean drinking water taps, fountains, and refill points'
  },
  'Charging Point': {
    icon: Zap,
    color: '#d97706', // Amber / Gold
    bgColor: '#fef3c7',
    badgeClass: 'badge-charge',
    description: 'Solar kiosks, phone charging lockers & EV charging points'
  },
  'Public Shelter': {
    icon: Home,
    color: '#059669', // Emerald
    bgColor: '#d1fae5',
    badgeClass: 'badge-shelter',
    description: 'Emergency winter shelters, temporary accommodation & day centers'
  },
  'Public Toilet': {
    icon: DoorClosed,
    color: '#6366f1', // Indigo
    bgColor: '#e0e7ff',
    badgeClass: 'badge-toilet',
    description: 'Accessible, clean public restrooms & automated automated toilets'
  },
  'Hospital & Clinic': {
    icon: HeartPulse,
    color: '#dc2626', // Red
    bgColor: '#fee2e2',
    badgeClass: 'badge-hospital',
    description: 'Urgent care facilities, public hospitals & emergency clinics'
  },
  'Community Facility': {
    icon: Users,
    color: '#0891b2', // Cyan / Teal
    bgColor: '#cffafe',
    badgeClass: 'badge-community',
    description: 'Public libraries, community youth & senior centers, food banks'
  }
};

export function getCategoryDetails(category) {
  return CATEGORY_CONFIG[category] || {
    icon: Compass,
    color: '#64748b',
    bgColor: '#f1f5f9',
    badgeClass: 'badge-default',
    description: 'Public community resource'
  };
}
