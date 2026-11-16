# Local Resource Map - Community Resource Directory
### A Complete, Modern & Responsive MERN Stack Web Application

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-0284c7?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%26%20Express-059669?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2F%20Mongoose-47a248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Leaflet](https://img.shields.io/badge/Maps-Interactive%20Leaflet%20OSM-10b981?style=flat-square&logo=leaflet)](https://leafletjs.com/)
[![Design](https://img.shields.io/badge/Palette-Green%2C%20White%20%26%20Blue-0ea5e9?style=flat-square)](#)

---

## 📌 Project Overview
**Local Resource Map** is a centralized, community-driven directory and interactive mapping platform designed to bridge information gaps for urban residents, travelers, and vulnerable community members. It enables anyone to discover verified public amenities such as **drinking water stations, solar device charging kiosks, emergency shelters, public restrooms, hospitals/urgent clinics, and community facilities**.

Built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js), this project features a modern **Green, White, and Blue** visual aesthetic, interactive OpenStreetMap Leaflet integration, an intelligent **30-day verification tracking system**, an issue reporting workflow, and a robust dual-mode database engine.

---

## 💡 Problem Statement Addressed
Residents and visitors frequently face challenges locating basic public amenities during emergencies, daily commutes, or extreme weather conditions. Public water taps may be non-functional, charging stations broken, or facility hours outdated. 

**Local Resource Map** resolves this by providing:
1. **Centralized Discovery:** Searchable, categorized repository of essential civic resources.
2. **Community Verification System:** Real-time freshness indicators that automatically highlight facilities unverified for over 30 days as **"Needs Verification"**.
3. **Crowdsourced Reporting:** Direct feedback loop allowing citizens to report broken fixtures, incorrect addresses, or closures.
4. **Interactive Map & Card Views:** Dual interface allowing users to explore via visual pins or structured cards with directions.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 18, Vite | Component-driven architecture, hooks, responsive UI |
| **Icons & UI** | Lucide React | Modern SVG icons for each community category |
| **Mapping** | Leaflet & React-Leaflet | OpenStreetMap tiles, custom category-coded pins |
| **Styling** | Modern CSS3 | Custom variables, glassmorphism, responsive grid |
| **Backend** | Node.js & Express.js | Modular RESTful API with validation & error handling |
| **Database** | MongoDB & Mongoose | Schemas, virtual fields, resilient in-memory fallback |

---

## 🌟 Key Features

### 1. Home Page & Hero Section
- Clean navigation bar with quick actions: **Submit Resource**, **Reset Sample Data**, and active database indicator.
- Search banner with live debounce search filtering by name, neighborhood, or access keywords.
- Dynamic metrics counter displaying **Active Resources**, **Verified Last 30 Days**, **Needs Verification (>30d)**, and **Reports Submitted**.

### 2. Resource Directory & Modern Cards
- Filterable grid with high-resolution image banners, category badges, opening hours, and amenities.
- Dual view toggle: **Card Directory** and **Interactive Map**.
- Smooth hover animations and elevation effects.

### 3. Search and Multi-Dimensional Filter
- Search by keyword, name, address, or amenity.
- Category chips with dynamic counters (Drinking Water, Charging Point, Public Shelter, Public Toilet, Hospital & Clinic, Community Facility).
- Neighborhood / City dropdown selector.
- **Needs Verification Toggle** (`> 30 days`) to immediately isolate facilities requiring community audit.
- Sorting options (Recently Added, Most Recently Verified, Needs Verification First, Alphabetical).

### 4. Interactive OpenStreetMap (Leaflet)
- Interactive map populated with custom-colored category pins.
- One-click popup summaries with opening hours, category tags, verification badges, and instant Google Maps navigation links.

### 5. Detailed Resource View (Modal)
- Full address and GPS coordinates.
- Operating hours and access guidelines (wheelchair ramps, fees, pet friendliness).
- List of amenities with visual verification checkmarks.
- Verification history and community confirmation count.
- Community feedback thread showing logged reports.

### 6. Add Resource Submission Form
- Form with live validation for name, category, address, city, hours, access notes, amenities, and contact info.
- **Auto-fill GPS button** using the browser's Geolocation API.

### 7. Issue Reporting System
- Form to report:
  - *Incorrect Address*
  - *Closed / Does Not Exist*
  - *Outdated Hours*
  - *Broken Amenity / Equipment*
  - *Hygiene / Cleanliness Issue*
  - *Other*
- Submissions are stored and displayed under the resource's detail view.

### 8. 30-Day Verification System
- Resources display their last verified date.
- Resources older than 30 days are automatically flagged with an amber warning badge: **`⚠️ Needs Verification (Xd)`**.
- Any community member can click **"Verify"** to confirm the facility is operational, which immediately resets the timer to today and increments the community trust counter.

### 9. Resilient Database Engine
- Pre-configured with **Mongoose models and schemas**.
- Connects automatically to local MongoDB (`mongodb://127.0.0.1:27017/local_resource_map`) or MongoDB Atlas.
- **Zero-Configuration Fallback:** If local MongoDB is not running, the backend seamlessly switches to an embedded high-availability in-memory database preloaded with sample data, ensuring the app runs out of the box for college demonstrations without setup roadblocks!

---

## 📂 Project Directory Structure

```text
local-resource-map/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection & graceful fallback logic
│   ├── controllers/
│   │   └── resourceController.js # REST API handlers (CRUD, verify, report, stats)
│   ├── data/
│   │   └── seedData.js           # 10 realistic community resources across 6 categories
│   ├── models/
│   │   ├── Resource.js           # Mongoose Schema with virtuals (daysSinceVerification)
│   │   └── IssueReport.js        # Mongoose Schema for community feedback
│   ├── routes/
│   │   └── resourceRoutes.js     # Express router endpoints
│   ├── services/
│   │   └── dataStore.js          # Unified data service (MongoDB + In-Memory fallback)
│   ├── .env                      # Environment config
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddResourceModal.jsx    # Resource submission modal
│   │   │   ├── CategoryFilter.jsx      # Filter chips, city dropdown & sort
│   │   │   ├── HeroBanner.jsx          # Header hero with search bar
│   │   │   ├── Navbar.jsx              # Navigation header with actions
│   │   │   ├── ReportIssueModal.jsx    # Issue reporting modal
│   │   │   ├── ResourceCard.jsx        # Resource card with status badge
│   │   │   ├── ResourceDetailModal.jsx # Full resource details modal
│   │   │   ├── ResourceList.jsx        # Grid container and empty states
│   │   │   ├── ResourceMap.jsx         # Leaflet interactive map with custom pins
│   │   │   ├── StatsSection.jsx        # Top metrics strip
│   │   │   └── Toast.jsx               # Floating notifications
│   │   ├── services/
│   │   │   └── api.js                  # Frontend API client
│   │   ├── utils/
│   │   │   └── categoryIcons.jsx       # Category colors, icons & definitions
│   │   ├── App.jsx                     # Main application orchestrator
│   │   ├── index.css                   # Global styling (Green, Blue, White theme)
│   │   └── main.jsx                    # React entry point
│   ├── index.html                      # HTML template with fonts and Leaflet CSS
│   ├── package.json                    # Frontend dependencies
│   └── vite.config.js                  # Vite configuration & backend proxy
│
├── package.json                        # Root helper scripts
├── start-dev.js                        # Concurrently runs frontend & backend
└── README.md                           # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- *(Optional)* **MongoDB Community Server** (if you wish to store data persistently in MongoDB)

---

### Step 1: Install Dependencies
Open a terminal in the root project folder:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root directory
cd ..
```

---

### Step 2: Configure Environment (Optional)
The backend includes a `.env` file pre-configured for local development:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/local_resource_map
NODE_ENV=development
```
> **Note:** If MongoDB is running on your machine or you provide a MongoDB Atlas connection string, it will automatically connect and seed MongoDB. If MongoDB is not running, the application runs seamlessly in high-availability In-Memory mode without crashing!

---

### Step 3: Run the Application

You can start both frontend and backend together with one command from the project root:

```bash
npm run dev
```

Or run them in separate terminal windows:

#### Terminal 1 (Backend Server):
```bash
cd backend
npm start
```
*Backend runs at: `http://localhost:5000`*

#### Terminal 2 (Frontend Client):
```bash
cd frontend
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

Open **`http://localhost:5173`** in your browser to view and use the application!

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/stats` | Directory overview metrics (total, verified, outdated, category counts) |
| `GET` | `/api/resources` | Fetch resources (Supports `?search=&category=&city=&needsVerification=true&sort=`) |
| `GET` | `/api/resources/:id` | Fetch single resource details |
| `POST` | `/api/resources` | Create a new community resource |
| `PUT` | `/api/resources/:id` | Update an existing resource |
| `DELETE` | `/api/resources/:id` | Remove a resource |
| `POST` | `/api/resources/:id/verify` | Confirm and reset verification timestamp to today |
| `POST` | `/api/resources/:id/report` | Submit an issue report regarding a resource |
| `GET` | `/api/resources/:id/reports` | Get all reports logged for a specific resource |
| `POST` | `/api/seed` | Reset and reload initial realistic sample data |

### Sample JSON: Create Resource (`POST /api/resources`)
```json
{
  "name": "Lincoln Square Drinking Fountain",
  "category": "Drinking Water",
  "address": "62nd St & Columbus Ave",
  "city": "Uptown",
  "lat": 40.7712,
  "lng": -73.9822,
  "openingHours": "06:00 AM - 10:00 PM",
  "accessNotes": "Wheelchair accessible drinking fountain and bottle refill station.",
  "amenities": ["Chilled Water", "Bottle Refill Unit", "Wheelchair Accessible"],
  "contactPhone": "+1 (555) 301-4422",
  "submittedBy": "Civic Volunteers"
}
```

### Sample JSON: Report Issue (`POST /api/resources/:id/report`)
```json
{
  "issueType": "Broken Amenity / Equipment",
  "description": "The water tap has low pressure and requires filter replacement.",
  "reportedBy": "Neighbor"
}
```

---

## 🎓 College Demonstration Guide

When presenting this project for evaluation or viva, highlight the following features:
1. **Full-Stack Integration:** Show how React frontend communicates with Express REST API endpoints via `fetch` and proxy settings.
2. **MongoDB Schemas & Virtuals:** Explain how Mongoose schema virtuals (`daysSinceVerification`, `isPotentiallyOutdated`) compute time elapsed dynamically.
3. **Automated 30-Day Flagging:** Point out cards marked with `⚠️ Needs Verification (>30d)`, click the `Verify` button, and show how the badge instantly transitions to `✓ Verified Today` without page reloads.
4. **Issue Reporting Feedback Loop:** Demonstrate submitting an issue report and viewing it rendered in the resource's details modal.
5. **Interactive Mapping:** Switch from Card view to Leaflet Map view, click pins to view custom popups and directions.
6. **Graceful Degradation:** Highlight that the backend detects MongoDB connectivity and falls back to an in-memory repository to guarantee zero-downtime demonstrations.

---

## 📄 License
This project is open-source and available under the MIT License.
