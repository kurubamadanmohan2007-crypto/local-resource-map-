import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import StatsSection from './components/StatsSection';
import CategoryFilter from './components/CategoryFilter';
import ResourceList from './components/ResourceList';
import ResourceMap from './components/ResourceMap';
import ResourceDetailModal from './components/ResourceDetailModal';
import AddResourceModal from './components/AddResourceModal';
import ReportIssueModal from './components/ReportIssueModal';
import Toast from './components/Toast';
import {
  fetchResources,
  createResource,
  verifyResource,
  reportIssue,
  fetchDirectoryStats,
  seedDatabase
} from './services/api';
import { LayoutGrid, Map as MapIcon, Heart, Compass } from 'lucide-react';

export default function App() {
  // Main Data States
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters and Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [needsVerificationOnly, setNeedsVerificationOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  // Modals & Action States
  const [selectedResource, setSelectedResource] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportingResource, setReportingResource] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Notification Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load Resources and Stats
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [resData, statsData] = await Promise.all([
        fetchResources({
          search: searchTerm,
          category: selectedCategory,
          city: selectedCity,
          needsVerification: needsVerificationOnly,
          sort: sortBy
        }),
        fetchDirectoryStats().catch(() => null)
      ]);

      setResources(resData.data || []);
      if (statsData?.data) {
        setStats(statsData.data);
      }
    } catch (err) {
      addToast('Error', err.message || 'Failed to load community resources', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedCity, needsVerificationOnly, sortBy]);

  // Initial and reactive load
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadData]);

  // Extract unique cities from current resources or all known
  const cities = useMemo(() => {
    const set = new Set();
    resources.forEach((r) => {
      if (r.city) set.add(r.city);
    });
    return Array.from(set).sort();
  }, [resources]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { total: resources.length };
    resources.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, [resources]);

  // Verification Handler (1-click verification)
  const handleVerify = async (id) => {
    try {
      setIsVerifying(true);
      const res = await verifyResource(id);
      addToast('Verification Successful', 'Thank you! Resource marked as verified today.', 'success');

      // Update in state locally immediately
      setResources((prev) =>
        prev.map((r) => (r._id === id ? { ...r, ...res.data, daysSinceVerification: 0, isPotentiallyOutdated: false } : r))
      );

      // If modal open, update modal object too
      if (selectedResource && selectedResource._id === id) {
        setSelectedResource((prev) => ({ ...prev, ...res.data, daysSinceVerification: 0, isPotentiallyOutdated: false }));
      }

      // Refresh directory stats
      fetchDirectoryStats().then((s) => s.data && setStats(s.data)).catch(() => {});
    } catch (err) {
      addToast('Verification Error', err.message, 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  // Add Resource Handler
  const handleAddResource = async (payload) => {
    try {
      setIsSubmitting(true);
      const res = await createResource(payload);
      addToast('Resource Added!', `${res.data.name} is now live in the community directory.`, 'success');
      setIsAddOpen(false);
      loadData();
    } catch (err) {
      addToast('Submission Error', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Report Issue Handler
  const handleReportIssue = async (id, reportData) => {
    try {
      setIsSubmitting(true);
      await reportIssue(id, reportData);
      addToast('Report Received', 'Thank you for reporting. Community admins will review this issue.', 'warning');
      setIsReportOpen(false);
      setReportingResource(null);
      // Refresh directory stats
      fetchDirectoryStats().then((s) => s.data && setStats(s.data)).catch(() => {});
    } catch (err) {
      addToast('Report Error', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Seed sample data
  const handleResetData = async () => {
    try {
      setIsSeeding(true);
      await seedDatabase();
      addToast('Database Reset', 'Sample community resources successfully reloaded.', 'success');
      loadData();
    } catch (err) {
      addToast('Reset Failed', err.message, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleOpenDetails = (resource) => {
    setSelectedResource(resource);
    setIsDetailOpen(true);
  };

  const handleTriggerReport = (resource) => {
    setReportingResource(resource);
    setIsReportOpen(true);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedCity('All');
    setNeedsVerificationOnly(false);
    setSortBy('default');
  };

  return (
    <div className="app-layout">
      {/* Navigation Bar */}
      <Navbar
        onOpenAddModal={() => setIsAddOpen(true)}
        onResetData={handleResetData}
        isSeeding={isSeeding}
        stats={stats}
      />

      <main>
        {/* Hero Landing & Search */}
        <HeroBanner
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={() => setSearchTerm('')}
        />

        <div className="container">
          {/* Quick Metrics Strip */}
          <StatsSection
            stats={stats}
            onFilterOutdated={() => setNeedsVerificationOnly((prev) => !prev)}
            isOutdatedFiltered={needsVerificationOnly}
          />

          {/* Filter Bar with Category chips, City selector, Outdated toggle */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            cities={cities}
            needsVerification={needsVerificationOnly}
            onToggleNeedsVerification={() => setNeedsVerificationOnly((prev) => !prev)}
            sortBy={sortBy}
            onSortChange={setSortBy}
            categoryCounts={categoryCounts}
          />

          {/* View Mode Bar: Results Count & Grid vs Map toggle */}
          <div className="view-mode-bar">
            <div className="results-count-text">
              Showing <strong>{resources.length}</strong> community resources
              {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
              {selectedCity !== 'All' && <span> in <strong>{selectedCity}</strong></span>}
              {needsVerificationOnly && <span style={{ color: '#b45309' }}> (Needs Verification &gt; 30d)</span>}
            </div>

            <div className="view-tabs">
              <button
                className={`view-tab-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={15} />
                <span>Card Directory</span>
              </button>
              <button
                className={`view-tab-btn ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
              >
                <MapIcon size={15} />
                <span>Interactive Map</span>
              </button>
            </div>
          </div>

          {/* Content View: Card Grid or Leaflet Map */}
          {viewMode === 'map' ? (
            <ResourceMap
              resources={resources}
              onViewDetails={handleOpenDetails}
              onVerify={handleVerify}
            />
          ) : (
            <ResourceList
              resources={resources}
              isLoading={loading}
              onViewDetails={handleOpenDetails}
              onVerify={handleVerify}
              onReportIssue={handleTriggerReport}
              isVerifying={isVerifying}
              onOpenAddModal={() => setIsAddOpen(true)}
              onResetFilters={handleResetFilters}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <ResourceDetailModal
        resource={selectedResource}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedResource(null);
        }}
        onVerify={handleVerify}
        onReportIssue={(res) => {
          setIsDetailOpen(false);
          handleTriggerReport(res);
        }}
        isVerifying={isVerifying}
      />

      <AddResourceModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddResource}
        isSubmitting={isSubmitting}
      />

      <ReportIssueModal
        resource={reportingResource}
        isOpen={isReportOpen}
        onClose={() => {
          setIsReportOpen(false);
          setReportingResource(null);
        }}
        onSubmit={handleReportIssue}
        isSubmitting={isSubmitting}
      />

      {/* Toast Notification Stack */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Modern Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.1rem' }}>
                <Compass size={20} color="#059669" />
                <span>Local Resource Map</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '6px', maxWidth: '400px' }}>
                A centralized, community-verified directory of drinking water, charging stations, shelters,
                restrooms, clinics, and public facilities.
              </p>
            </div>

            <div className="footer-credits">
              <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                MERN Stack College Demonstration Project
              </div>
              <div style={{ color: '#64748b' }}>
                React.js &bull; Node.js &bull; Express.js &bull; MongoDB / Mongoose &bull; Leaflet Maps
              </div>
            </div>
          </div>

          <div className="footer-copy">
            &copy; {new Date().getFullYear()} Local Resource Map &bull; Built with clean Green, Blue &amp; White design.
          </div>
        </div>
      </footer>
    </div>
  );
}
