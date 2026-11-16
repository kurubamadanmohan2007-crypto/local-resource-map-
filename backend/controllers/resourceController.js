const dataStore = require('../services/dataStore');

// Valid categories
const VALID_CATEGORIES = [
  'Drinking Water',
  'Charging Point',
  'Public Shelter',
  'Public Toilet',
  'Hospital & Clinic',
  'Community Facility'
];

// @desc    Get all resources with search, filter, and sort
// @route   GET /api/resources
exports.getAllResources = async (req, res) => {
  try {
    const resources = await dataStore.getResources(req.query);
    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resources: ' + err.message
    });
  }
};

// @desc    Get single resource by ID
// @route   GET /api/resources/:id
exports.getResourceById = async (req, res) => {
  try {
    const resource = await dataStore.getResourceById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message
    });
  }
};

// @desc    Create a new community resource
// @route   POST /api/resources
exports.createResource = async (req, res) => {
  try {
    const {
      name,
      category,
      address,
      city,
      lat,
      lng,
      openingHours,
      accessNotes,
      amenities,
      contactPhone,
      imageUrl,
      submittedBy
    } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Resource name is required' });
    }
    if (!category || !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}`
      });
    }
    if (!address || !address.trim()) {
      return res.status(400).json({ success: false, message: 'Street address is required' });
    }
    if (!city || !city.trim()) {
      return res.status(400).json({ success: false, message: 'City or area is required' });
    }

    // Coordinates fallback (default to center of map if not specified)
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const coordinates = {
      lat: !isNaN(parsedLat) ? parsedLat : 40.758896,
      lng: !isNaN(parsedLng) ? parsedLng : -73.985130
    };

    // Default category images if image URL is empty
    const defaultImages = {
      'Drinking Water': 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
      'Charging Point': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80',
      'Public Shelter': 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
      'Public Toilet': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      'Hospital & Clinic': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      'Community Facility': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80'
    };

    const newResourceData = {
      name: name.trim(),
      category,
      address: address.trim(),
      city: city.trim(),
      coordinates,
      openingHours: openingHours && openingHours.trim() ? openingHours.trim() : '24/7 (Always Open)',
      accessNotes: accessNotes && accessNotes.trim() ? accessNotes.trim() : 'Publicly accessible to everyone.',
      amenities: Array.isArray(amenities)
        ? amenities.filter(a => a && typeof a === 'string' && a.trim())
        : (typeof amenities === 'string' ? amenities.split(',').map(s => s.trim()).filter(Boolean) : []),
      contactPhone: contactPhone ? contactPhone.trim() : '',
      imageUrl: imageUrl && imageUrl.trim() ? imageUrl.trim() : defaultImages[category] || '',
      submittedBy: submittedBy && submittedBy.trim() ? submittedBy.trim() : 'Community Volunteer',
      lastVerified: new Date(),
      verificationCount: 1,
      status: 'Active'
    };

    const created = await dataStore.createResource(newResourceData);

    res.status(201).json({
      success: true,
      message: 'Resource registered successfully!',
      data: created
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to create resource: ' + err.message
    });
  }
};

// @desc    Update an existing resource
// @route   PUT /api/resources/:id
exports.updateResource = async (req, res) => {
  try {
    const updated = await dataStore.updateResource(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to update resource: ' + err.message
    });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
exports.deleteResource = async (req, res) => {
  try {
    const deleted = await dataStore.deleteResource(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Resource removed successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete resource: ' + err.message
    });
  }
};

// @desc    Verify a resource (reset lastVerified to now, increment count)
// @route   POST /api/resources/:id/verify
exports.verifyResource = async (req, res) => {
  try {
    const resource = await dataStore.verifyResource(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Resource verified successfully! Last verified timestamp updated.',
      data: resource
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Verification failed: ' + err.message
    });
  }
};

// @desc    Report an issue on a resource
// @route   POST /api/resources/:id/report
exports.reportIssue = async (req, res) => {
  try {
    const { issueType, description, reportedBy } = req.body;

    if (!issueType) {
      return res.status(400).json({ success: false, message: 'Issue type is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Please describe the issue' });
    }

    const resource = await dataStore.getResourceById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Target resource not found' });
    }

    const report = await dataStore.addIssueReport(req.params.id, {
      issueType,
      description: description.trim(),
      reportedBy: reportedBy && reportedBy.trim() ? reportedBy.trim() : 'Anonymous Resident'
    });

    res.status(201).json({
      success: true,
      message: 'Issue report submitted successfully. Thank you for helping keep our community map accurate!',
      data: report
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit report: ' + err.message
    });
  }
};

// @desc    Get all reports for a resource
// @route   GET /api/resources/:id/reports
exports.getResourceReports = async (req, res) => {
  try {
    const reports = await dataStore.getReportsForResource(req.params.id);
    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports: ' + err.message
    });
  }
};

// @desc    Get overall directory statistics
// @route   GET /api/stats
exports.getStats = async (req, res) => {
  try {
    const stats = await dataStore.getDirectoryStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch directory statistics: ' + err.message
    });
  }
};

// @desc    Seed sample data
// @route   POST /api/seed
exports.seedDatabase = async (req, res) => {
  try {
    const result = await dataStore.seedDatabase();
    res.status(200).json({
      success: true,
      message: `Database successfully seeded with sample data in ${result.mode}`,
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Seeding failed: ' + err.message
    });
  }
};
