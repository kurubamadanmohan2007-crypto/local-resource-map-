const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Resource name is required'],
    trim: true,
    maxlength: [120, 'Name cannot exceed 120 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'Drinking Water',
        'Charging Point',
        'Public Shelter',
        'Public Toilet',
        'Hospital & Clinic',
        'Community Facility'
      ],
      message: '{VALUE} is not a valid category'
    }
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City / Area is required'],
    trim: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required']
    }
  },
  openingHours: {
    type: String,
    default: '24/7 (Always Open)',
    trim: true
  },
  accessNotes: {
    type: String,
    default: 'Publicly accessible to everyone.',
    trim: true
  },
  amenities: {
    type: [String],
    default: []
  },
  contactPhone: {
    type: String,
    trim: true,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  lastVerified: {
    type: Date,
    default: Date.now
  },
  verificationCount: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['Active', 'Under Review', 'Temporarily Closed'],
    default: 'Active'
  },
  submittedBy: {
    type: String,
    default: 'Community Volunteer'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual property to calculate days since last verification
ResourceSchema.virtual('daysSinceVerification').get(function () {
  if (!this.lastVerified) return 999;
  const diffTime = Math.abs(Date.now() - new Date(this.lastVerified).getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual property to check if it's considered outdated (> 30 days)
ResourceSchema.virtual('isPotentiallyOutdated').get(function () {
  return this.daysSinceVerification > 30;
});

module.exports = mongoose.model('Resource', ResourceSchema);
