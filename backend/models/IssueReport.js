const mongoose = require('mongoose');

const IssueReportSchema = new mongoose.Schema({
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  issueType: {
    type: String,
    required: [true, 'Issue type is required'],
    enum: [
      'Incorrect Address',
      'Closed / Does Not Exist',
      'Outdated Hours',
      'Broken Amenity / Equipment',
      'Hygiene / Cleanliness Issue',
      'Other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Please provide details about the issue'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  reportedBy: {
    type: String,
    default: 'Anonymous Resident',
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending Review', 'Under Investigation', 'Resolved', 'Dismissed'],
    default: 'Pending Review'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('IssueReport', IssueReportSchema);
