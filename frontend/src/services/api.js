// API Client service for connecting React frontend to Express backend

const API_BASE = '/api';

export async function fetchResources(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.city && params.city !== 'All') query.append('city', params.city);
  if (params.needsVerification) query.append('needsVerification', 'true');
  if (params.sort) query.append('sort', params.sort);

  const res = await fetch(`${API_BASE}/resources?${query.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch resources');
  }
  return res.json();
}

export async function fetchResourceById(id) {
  const res = await fetch(`${API_BASE}/resources/${id}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Resource not found');
  }
  return res.json();
}

export async function createResource(resourceData) {
  const res = await fetch(`${API_BASE}/resources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resourceData)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create resource');
  }
  return data;
}

export async function verifyResource(id) {
  const res = await fetch(`${API_BASE}/resources/${id}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to verify resource');
  }
  return data;
}

export async function reportIssue(id, issueData) {
  const res = await fetch(`${API_BASE}/resources/${id}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(issueData)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to submit report');
  }
  return data;
}

export async function fetchReports(id) {
  const res = await fetch(`${API_BASE}/resources/${id}/reports`);
  if (!res.ok) {
    throw new Error('Failed to fetch reports');
  }
  return res.json();
}

export async function fetchDirectoryStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) {
    throw new Error('Failed to load stats');
  }
  return res.json();
}

export async function seedDatabase() {
  const res = await fetch(`${API_BASE}/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to reset and seed database');
  }
  return data;
}
