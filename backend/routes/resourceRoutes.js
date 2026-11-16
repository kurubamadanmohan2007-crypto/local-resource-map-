const express = require('express');
const router = express.Router();
const {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  verifyResource,
  reportIssue,
  getResourceReports,
  getStats,
  seedDatabase
} = require('../controllers/resourceController');

// Stats route
router.get('/stats', getStats);

// Seed route
router.post('/seed', seedDatabase);

// Resource CRUD routes
router.route('/resources')
  .get(getAllResources)
  .post(createResource);

router.route('/resources/:id')
  .get(getResourceById)
  .put(updateResource)
  .delete(deleteResource);

// Verification and Reporting routes
router.post('/resources/:id/verify', verifyResource);
router.post('/resources/:id/report', reportIssue);
router.get('/resources/:id/reports', getResourceReports);

module.exports = router;
