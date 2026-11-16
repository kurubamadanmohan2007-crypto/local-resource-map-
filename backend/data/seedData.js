// Sample Community Resource Data
// Provides realistic initial resources across: Drinking Water, Charging Point, Public Shelter, Public Toilet, Hospital & Clinic, Community Facility

const now = new Date();
const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

const sampleResources = [
  {
    name: "Central Park PureFlow Water Station",
    category: "Drinking Water",
    address: "North Gate Plaza, Central City Park, 4th Avenue",
    city: "Downtown",
    coordinates: { lat: 40.785091, lng: -73.968285 },
    openingHours: "05:00 AM - 10:00 PM (Daily)",
    accessNotes: "Wheelchair accessible drinking fountain and bottle refilling station with chilled RO water.",
    amenities: ["Chilled Water", "Bottle Refill Unit", "Wheelchair Accessible", "Pet Water Basin"],
    contactPhone: "+1 (555) 234-8901",
    imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80",
    lastVerified: daysAgo(4), // Recently verified
    verificationCount: 14,
    status: "Active",
    submittedBy: "GreenCity Volunteer Group"
  },
  {
    name: "Civic Center Solar Charging Hub",
    category: "Charging Point",
    address: "East Pavilion, 120 Civic Center Promenade",
    city: "Downtown",
    coordinates: { lat: 40.712776, lng: -74.005974 },
    openingHours: "24/7 (Always Open)",
    accessNotes: "Free solar-powered phone & laptop charging benches. Standard USB-A, USB-C fast charging, and wireless Qi pads available.",
    amenities: ["USB-C 65W Fast Charge", "Wireless Qi Pads", "Solar Powered", "Free High-Speed Wi-Fi", "Night Lighting"],
    contactPhone: "+1 (555) 432-1199",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
    lastVerified: daysAgo(38), // >30 days ago (Triggers verification warning!)
    verificationCount: 8,
    status: "Active",
    submittedBy: "Tech4Community"
  },
  {
    name: "Hope Haven Emergency & Winter Shelter",
    category: "Public Shelter",
    address: "740 Oakwood Boulevard, Sector 9",
    city: "Midtown",
    coordinates: { lat: 40.758896, lng: -73.985130 },
    openingHours: "Open 24/7 for Emergency Intake",
    accessNotes: "Overnight shelter, heated beds, warm meals served at 7 AM, 12 PM, 6 PM. Security staff on site at all times.",
    amenities: ["Emergency Beds", "Hot Meals", "Showers & Hygiene Kits", "Mental Health Counseling", "Medical Triage"],
    contactPhone: "+1 (555) 888-4357",
    imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80",
    lastVerified: daysAgo(2), // Recently verified
    verificationCount: 32,
    status: "Active",
    submittedBy: "Metropolitan Relief Coalition"
  },
  {
    name: "Metro Clean Automated Public Restroom",
    category: "Public Toilet",
    address: "Grand Central Transit Concourse, Platform Level B",
    city: "Central Transit Zone",
    coordinates: { lat: 40.752726, lng: -73.977229 },
    openingHours: "06:00 AM - 11:30 PM",
    accessNotes: "Self-cleaning public unisex toilets, touchless soap/water/dryer, baby changing tables, panic alarm button.",
    amenities: ["Touchless Fixtures", "Wheelchair Accessible", "Baby Changing Station", "Self-Disinfecting", "Emergency Alarm"],
    contactPhone: "+1 (555) 901-5544",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    lastVerified: daysAgo(45), // >30 days ago (Triggers verification warning!)
    verificationCount: 5,
    status: "Active",
    submittedBy: "Transit Volunteers"
  },
  {
    name: "St. Jude Community Health & Urgent Clinic",
    category: "Hospital & Clinic",
    address: "512 Pinecrest Avenue, Health District",
    city: "Uptown",
    coordinates: { lat: 40.773565, lng: -73.956555 },
    openingHours: "24/7 Emergency & Urgent Care",
    accessNotes: "Walk-ins welcomed. Free emergency stabilization, generic medications at subsidized rates, multilingual staff.",
    amenities: ["24/7 ER", "Subsidized Pharmacy", "Multilingual Translators", "Ambulance Bay", "Pediatric Care"],
    contactPhone: "+1 (555) 345-9000",
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    lastVerified: daysAgo(6), // Recently verified
    verificationCount: 45,
    status: "Active",
    submittedBy: "Dr. Sarah Chen, MD"
  },
  {
    name: "Maple Grove Community Center & Library",
    category: "Community Facility",
    address: "320 Maple Grove Way",
    city: "Eastside",
    coordinates: { lat: 40.741895, lng: -73.989308 },
    openingHours: "08:00 AM - 09:00 PM (Mon-Sat), 10:00 AM - 05:00 PM (Sun)",
    accessNotes: "Public study spaces, digital library, cooling/heating zone during extreme weather, free community meeting rooms.",
    amenities: ["Free Computer Lab", "Air Conditioned / Heating Zone", "Senior Citizens Lounge", "Children Reading Corner", "Public Restrooms"],
    contactPhone: "+1 (555) 678-2233",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    lastVerified: daysAgo(12), // Recently verified
    verificationCount: 19,
    status: "Active",
    submittedBy: "Maple Grove Neighborhood Council"
  },
  {
    name: "Riverside Promenade Filtered Water Tap",
    category: "Drinking Water",
    address: "Mile Marker 3.2, Riverside Greenbelt Trail",
    city: "Westside",
    coordinates: { lat: 40.798433, lng: -73.971234 },
    openingHours: "06:00 AM - 09:00 PM",
    accessNotes: "Triple-stage filtered drinking water tap with dual spouts for runners and bicycles.",
    amenities: ["Triple Filtration", "Bicycle Bottle Friendly", "Shaded Rest Area"],
    contactPhone: "",
    imageUrl: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80",
    lastVerified: daysAgo(52), // >30 days ago (Triggers verification warning!)
    verificationCount: 3,
    status: "Active",
    submittedBy: "Westside Runners Club"
  },
  {
    name: "South End EV & Device Solar Kiosk",
    category: "Charging Point",
    address: "Market Square, Corner of 9th & Elm",
    city: "South End",
    coordinates: { lat: 40.728956, lng: -73.993214 },
    openingHours: "24/7 (Always Open)",
    accessNotes: "Equipped with 4 EV Level-2 charge plugs and 8 weather-sealed USB charging ports with lockable phone cubbies.",
    amenities: ["Level 2 EV Charging", "Lockable Phone Lockers", "USB-A & Type-C", "CCTV Surveillance"],
    contactPhone: "+1 (555) 912-8877",
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    lastVerified: daysAgo(1), // Recently verified
    verificationCount: 22,
    status: "Active",
    submittedBy: "EcoMotion City Initiative"
  },
  {
    name: "Sunrise Community Food Bank & Resource Hub",
    category: "Community Facility",
    address: "880 Sunrise Highway",
    city: "Midtown",
    coordinates: { lat: 40.764421, lng: -73.973412 },
    openingHours: "09:00 AM - 06:00 PM (Mon-Fri)",
    accessNotes: "Provides emergency dry food parcels, fresh produce, baby formula, and guidance on local social assistance programs.",
    amenities: ["Fresh Produce", "Infant Supplies", "Social Worker Desk", "Wheelchair Ramp"],
    contactPhone: "+1 (555) 777-6210",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
    lastVerified: daysAgo(35), // >30 days ago (Triggers verification warning!)
    verificationCount: 11,
    status: "Active",
    submittedBy: "Community Food Alliance"
  },
  {
    name: "Harborview Public Sanitized Restroom",
    category: "Public Toilet",
    address: "Ferry Terminal Pier 11, Harbor Esplanade",
    city: "Downtown Waterfront",
    coordinates: { lat: 40.703211, lng: -74.008432 },
    openingHours: "05:30 AM - 11:00 PM",
    accessNotes: "Full attendant on duty during day hours. Fully ADA compliant with family restrooms.",
    amenities: ["Attendant on Duty", "Family Restroom", "Wheelchair Accessible", "Sanitary Supplies Dispenser"],
    contactPhone: "+1 (555) 441-2098",
    imageUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
    lastVerified: daysAgo(5), // Recently verified
    verificationCount: 16,
    status: "Active",
    submittedBy: "Harbor Tourism Council"
  }
];

module.exports = sampleResources;
