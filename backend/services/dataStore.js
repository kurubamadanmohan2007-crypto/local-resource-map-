// Unified Data Layer: Supports MongoDB (via Mongoose) with automatic in-memory fallback
const mongoose = require('mongoose');
const Resource = require('../models/Resource');
const IssueReport = require('../models/IssueReport');
const sampleResources = require('../data/seedData');

let isMongoConnected = false;

// In-Memory store fallback
let memResources = [];
let memReports = [];

function calculateVerificationFields(resource) {
  const lastVerified = resource.lastVerified ? new Date(resource.lastVerified) : new Date();
  const diffTime = Math.abs(Date.now() - lastVerified.getTime());
  const daysSinceVerification = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const isPotentiallyOutdated = daysSinceVerification > 30;

  return {
    ...resource,
    daysSinceVerification,
    isPotentiallyOutdated
  };
}

function initializeInMemory() {
  memResources = sampleResources.map((res, index) => {
    return calculateVerificationFields({
      ...res,
      _id: `mem_res_${index + 1}`,
      createdAt: new Date(Date.now() - (index + 2) * 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    });
  });

  memReports = [
    {
      _id: 'mem_rep_1',
      resourceId: 'mem_res_2',
      issueType: 'Broken Amenity / Equipment',
      description: 'One of the USB-C cables has a loose contact, solar panel working fine.',
      reportedBy: 'Alex Chen',
      status: 'Pending Review',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    }
  ];

  console.log(`[DataStore] In-memory fallback loaded with ${memResources.length} community resources.`);
}

// Check MongoDB connection
function setMongoStatus(status) {
  isMongoConnected = status;
}

function getMongoStatus() {
  return isMongoConnected;
}

// SEED MongoDB or In-Memory
async function seedDatabase() {
  if (isMongoConnected) {
    try {
      await Resource.deleteMany({});
      await IssueReport.deleteMany({});
      const created = await Resource.insertMany(sampleResources);
      console.log(`[DataStore] MongoDB seeded with ${created.length} resources.`);
      return { success: true, count: created.length, mode: 'MongoDB' };
    } catch (err) {
      console.error('[DataStore] Error seeding MongoDB:', err.message);
      throw err;
    }
  } else {
    initializeInMemory();
    return { success: true, count: memResources.length, mode: 'In-Memory Store' };
  }
}

// GET ALL RESOURCES (with search, category, outdated filter, sorting)
async function getResources(query = {}) {
  const { search, category, city, needsVerification, sort } = query;

  if (isMongoConnected) {
    let mongoQuery = { status: { $ne: 'Inactive' } };

    if (category && category !== 'All') {
      mongoQuery.category = category;
    }

    if (city && city !== 'All') {
      mongoQuery.city = new RegExp(city, 'i');
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      mongoQuery.$or = [
        { name: searchRegex },
        { address: searchRegex },
        { city: searchRegex },
        { accessNotes: searchRegex }
      ];
    }

    let results = await Resource.find(mongoQuery).lean({ virtuals: true });

    // Filter by verification status if requested
    if (needsVerification === 'true') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      results = results.filter(r => new Date(r.lastVerified) < thirtyDaysAgo);
    }

    // Sort results
    if (sort === 'verified_recent') {
      results.sort((a, b) => new Date(b.lastVerified) - new Date(a.lastVerified));
    } else if (sort === 'verified_oldest') {
      results.sort((a, b) => new Date(a.lastVerified) - new Date(b.lastVerified));
    } else if (sort === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: newly updated / verified first
      results.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    }

    // Ensure virtuals are calculated
    return results.map(r => calculateVerificationFields(r));
  } else {
    // In-memory filter
    let results = [...memResources];

    if (category && category !== 'All') {
      results = results.filter(r => r.category.toLowerCase() === category.toLowerCase());
    }

    if (city && city !== 'All') {
      results = results.filter(r => r.city.toLowerCase().includes(city.toLowerCase()));
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        (r.accessNotes && r.accessNotes.toLowerCase().includes(q))
      );
    }

    if (needsVerification === 'true') {
      results = results.filter(r => r.isPotentiallyOutdated);
    }

    if (sort === 'verified_recent') {
      results.sort((a, b) => new Date(b.lastVerified) - new Date(a.lastVerified));
    } else if (sort === 'verified_oldest') {
      results.sort((a, b) => new Date(a.lastVerified) - new Date(b.lastVerified));
    } else if (sort === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      results.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    }

    return results;
  }
}

// GET SINGLE RESOURCE BY ID
async function getResourceById(id) {
  if (isMongoConnected) {
    const resource = await Resource.findById(id).lean({ virtuals: true });
    if (!resource) return null;
    return calculateVerificationFields(resource);
  } else {
    const found = memResources.find(r => String(r._id) === String(id));
    return found ? calculateVerificationFields(found) : null;
  }
}

// CREATE RESOURCE
async function createResource(data) {
  if (isMongoConnected) {
    const created = await Resource.create(data);
    const obj = created.toObject({ virtuals: true });
    return calculateVerificationFields(obj);
  } else {
    const newId = `mem_res_${Date.now()}`;
    const newResource = calculateVerificationFields({
      ...data,
      _id: newId,
      lastVerified: new Date(),
      verificationCount: 1,
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    memResources.unshift(newResource);
    return newResource;
  }
}

// UPDATE RESOURCE
async function updateResource(id, data) {
  if (isMongoConnected) {
    const updated = await Resource.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean({ virtuals: true });
    return updated ? calculateVerificationFields(updated) : null;
  } else {
    const index = memResources.findIndex(r => String(r._id) === String(id));
    if (index === -1) return null;
    memResources[index] = calculateVerificationFields({
      ...memResources[index],
      ...data,
      updatedAt: new Date().toISOString()
    });
    return memResources[index];
  }
}

// DELETE RESOURCE
async function deleteResource(id) {
  if (isMongoConnected) {
    const deleted = await Resource.findByIdAndDelete(id);
    return !!deleted;
  } else {
    const initialLen = memResources.length;
    memResources = memResources.filter(r => String(r._id) !== String(id));
    return memResources.length < initialLen;
  }
}

// VERIFY RESOURCE (Sets lastVerified to now, increments verificationCount)
async function verifyResource(id) {
  const now = new Date();
  if (isMongoConnected) {
    const updated = await Resource.findByIdAndUpdate(
      id,
      {
        $set: { lastVerified: now },
        $inc: { verificationCount: 1 }
      },
      { new: true }
    ).lean({ virtuals: true });
    return updated ? calculateVerificationFields(updated) : null;
  } else {
    const index = memResources.findIndex(r => String(r._id) === String(id));
    if (index === -1) return null;
    memResources[index].lastVerified = now.toISOString();
    memResources[index].verificationCount = (memResources[index].verificationCount || 1) + 1;
    memResources[index].updatedAt = now.toISOString();
    memResources[index] = calculateVerificationFields(memResources[index]);
    return memResources[index];
  }
}

// ADD ISSUE REPORT
async function addIssueReport(resourceId, reportData) {
  if (isMongoConnected) {
    const report = await IssueReport.create({
      resourceId,
      ...reportData
    });
    return report;
  } else {
    const newReport = {
      _id: `mem_rep_${Date.now()}`,
      resourceId: String(resourceId),
      issueType: reportData.issueType,
      description: reportData.description,
      reportedBy: reportData.reportedBy || 'Anonymous Resident',
      status: 'Pending Review',
      createdAt: new Date().toISOString()
    };
    memReports.unshift(newReport);
    return newReport;
  }
}

// GET REPORTS FOR RESOURCE
async function getReportsForResource(resourceId) {
  if (isMongoConnected) {
    return await IssueReport.find({ resourceId }).sort({ createdAt: -1 }).lean();
  } else {
    return memReports.filter(rep => String(rep.resourceId) === String(resourceId));
  }
}

// GET DIRECTORY STATS (Total resources, by category, outdated count, verified count)
async function getDirectoryStats() {
  const allResources = await getResources();
  const total = allResources.length;
  const outdatedCount = allResources.filter(r => r.isPotentiallyOutdated).length;
  const verifiedRecentlyCount = total - outdatedCount;

  const categoryCounts = {};
  allResources.forEach(r => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });

  let totalReports = 0;
  if (isMongoConnected) {
    totalReports = await IssueReport.countDocuments();
  } else {
    totalReports = memReports.length;
  }

  return {
    totalResources: total,
    outdatedCount,
    verifiedRecentlyCount,
    categoryCounts,
    totalReports,
    storageMode: isMongoConnected ? 'MongoDB' : 'In-Memory Store (Auto-Fallback)'
  };
}

module.exports = {
  setMongoStatus,
  getMongoStatus,
  seedDatabase,
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  verifyResource,
  addIssueReport,
  getReportsForResource,
  getDirectoryStats,
  initializeInMemory
};
