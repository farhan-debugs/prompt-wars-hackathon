// Mock Geospatial Data for Urban Flood Navigation App (SafeRoute / FloodWise)

export const CITIES = [
  { id: 'kolkata', name: 'Kolkata, IN', center: [22.5726, 88.3639], zoom: 12 },
  { id: 'mumbai', name: 'Mumbai, IN', center: [19.0760, 72.8777], zoom: 12 },
  { id: 'nyc', name: 'New York City, US', center: [40.7128, -74.0060], zoom: 12 },
  { id: 'chennai', name: 'Chennai, IN', center: [13.0827, 80.2707], zoom: 12 }
];

export const PRESET_QUERIES = [
  {
    cityId: 'kolkata',
    text: "How do I get from Salt Lake to Howrah avoiding flooded roads?",
    label: "Salt Lake ➔ Howrah (Flood Bypass)"
  },
  {
    cityId: 'kolkata',
    text: "Is Park Street to Airport safe for a motorcycle right now?",
    label: "Park St ➔ Airport (Bike Risk)"
  },
  {
    cityId: 'mumbai',
    text: "Navigate from Hindmata to BKC avoiding waterlogged spots",
    label: "Hindmata ➔ BKC (Mumbai Flood)"
  },
  {
    cityId: 'nyc',
    text: "Route from Financial District to Williamsburg avoiding storm surge areas",
    label: "Lower Manhattan ➔ Brooklyn (Surge)"
  }
];

// Flood Prone GeoJSON Zones
export const FLOOD_ZONES = {
  kolkata: [
    {
      id: 'fz-kol-1',
      name: 'Sector V Ultadanga Underpass Zone',
      severity: 'HIGH', // HIGH, MEDIUM, LOW
      waterDepthCm: 55,
      riskScoreBonus: 45,
      description: 'Severe waterlogging under rail bridge due to heavy surface runoff.',
      coordinates: [
        [22.5830, 88.3980],
        [22.5890, 88.4050],
        [22.5860, 88.4120],
        [22.5790, 88.4050],
        [22.5830, 88.3980]
      ]
    },
    {
      id: 'fz-kol-2',
      name: 'College Street Waterway Corridor',
      severity: 'HIGH',
      waterDepthCm: 42,
      riskScoreBonus: 38,
      description: 'Drainage overflow affecting College Street tram line.',
      coordinates: [
        [22.5710, 88.3610],
        [22.5770, 88.3650],
        [22.5740, 88.3710],
        [22.5680, 88.3670],
        [22.5710, 88.3610]
      ]
    },
    {
      id: 'fz-kol-3',
      name: 'Central Avenue Low-lying Basin',
      severity: 'MEDIUM',
      waterDepthCm: 25,
      riskScoreBonus: 22,
      description: 'Moderate water pooling along MG Road junction.',
      coordinates: [
        [22.5800, 88.3580],
        [22.5840, 88.3620],
        [22.5810, 88.3660],
        [22.5770, 88.3620],
        [22.5800, 88.3580]
      ]
    },
    {
      id: 'fz-kol-4',
      name: 'EM Bypass Ruby Junction Dip',
      severity: 'MEDIUM',
      waterDepthCm: 18,
      riskScoreBonus: 15,
      description: 'Slow drainage resulting in lane submergence.',
      coordinates: [
        [22.5150, 88.3950],
        [22.5200, 88.4000],
        [22.5180, 88.4050],
        [22.5120, 88.3990],
        [22.5150, 88.3950]
      ]
    }
  ],
  mumbai: [
    {
      id: 'fz-mum-1',
      name: 'Hindmata Flyover Low Area',
      severity: 'HIGH',
      waterDepthCm: 65,
      riskScoreBonus: 50,
      description: 'High tide combined with heavy monsoonal rain submerging main artery.',
      coordinates: [
        [19.0080, 72.8420],
        [19.0140, 72.8470],
        [19.0110, 72.8540],
        [19.0040, 72.8480],
        [19.0080, 72.8420]
      ]
    },
    {
      id: 'fz-mum-2',
      name: 'Sion Circle Railway Subway',
      severity: 'HIGH',
      waterDepthCm: 50,
      riskScoreBonus: 40,
      description: 'Subway completely inundated, impassable for light vehicles.',
      coordinates: [
        [19.0380, 72.8600],
        [19.0430, 72.8650],
        [19.0400, 72.8710],
        [19.0350, 72.8660],
        [19.0380, 72.8600]
      ]
    }
  ]
};

// Demo Preset Routes with detailed coordinate paths
export const MOCK_ROUTES = {
  'Salt Lake-Howrah': {
    originName: 'Salt Lake City (Sector V)',
    originCoords: [22.5800, 88.4170],
    destinationName: 'Howrah Railway Station',
    destinationCoords: [22.5840, 88.3420],
    
    // Direct Route (High Risk - passes straight through Ultadanga & College St flood zones)
    directRoute: {
      id: 'route-direct',
      name: 'Direct Route (via Ultadanga Main Rd & College St)',
      distanceKm: 9.8,
      etaMins: 45,
      riskLevel: 'HIGH',
      riskScore: 78, // High risk out of 100
      intersectedZones: ['Sector V Ultadanga Underpass Zone', 'College Street Waterway Corridor'],
      maxWaterDepth: '55 cm',
      coordinates: [
        [22.5800, 88.4170],
        [22.5830, 88.4050], // intersects fz-kol-1 (High Risk)
        [22.5860, 88.3880],
        [22.5740, 88.3680], // intersects fz-kol-2 (High Risk)
        [22.5770, 88.3520],
        [22.5840, 88.3420]
      ]
    },
    
    // Safer Recommended Detour Route (Low Risk - circumvents flood zones via Bypass & Belgachia Elevated Cut)
    safeRoute: {
      id: 'route-safe',
      name: 'Recommended Safe Route (via Belgachia Flyover & Strand Rd)',
      distanceKm: 11.2,
      etaMins: 32,
      riskLevel: 'LOW',
      riskScore: 18, // Low risk out of 100
      intersectedZones: [],
      maxWaterDepth: '5 cm',
      coordinates: [
        [22.5800, 88.4170],
        [22.5930, 88.4100],
        [22.6010, 88.3880], // Belgachia Flyover (elevated)
        [22.5960, 88.3600],
        [22.5880, 88.3480], // Strand Rd High Embankment
        [22.5840, 88.3420]
      ]
    },

    // Alternative Route 2 (Medium Risk)
    altRoute: {
      id: 'route-alt',
      name: 'Alternative Route (via Park Circus & AJC Bose Flyover)',
      distanceKm: 12.5,
      etaMins: 38,
      riskLevel: 'MEDIUM',
      riskScore: 42,
      intersectedZones: ['EM Bypass Ruby Junction Dip'],
      maxWaterDepth: '18 cm',
      coordinates: [
        [22.5800, 88.4170],
        [22.5500, 88.3980],
        [22.5440, 88.3680],
        [22.5680, 88.3450],
        [22.5840, 88.3420]
      ]
    }
  },

  'Park St-Airport': {
    originName: 'Park Street',
    originCoords: [22.5550, 88.3520],
    destinationName: 'Kolkata Airport (CCU)',
    destinationCoords: [22.6540, 88.4460],
    
    directRoute: {
      id: 'route-direct-2',
      name: 'Direct Route (via Central Ave & VIP Rd Dip)',
      distanceKm: 16.2,
      etaMins: 55,
      riskLevel: 'HIGH',
      riskScore: 82,
      intersectedZones: ['College Street Waterway Corridor', 'Central Avenue Low-lying Basin'],
      maxWaterDepth: '42 cm',
      coordinates: [
        [22.5550, 88.3520],
        [22.5710, 88.3610],
        [22.5840, 88.3620],
        [22.6200, 88.4100],
        [22.6540, 88.4460]
      ]
    },
    
    safeRoute: {
      id: 'route-safe-2',
      name: 'Recommended Safe Route (via New Town Major Arterial Expressway)',
      distanceKm: 18.5,
      etaMins: 36,
      riskLevel: 'LOW',
      riskScore: 14,
      intersectedZones: [],
      maxWaterDepth: '2 cm',
      coordinates: [
        [22.5550, 88.3520],
        [22.5400, 88.3900],
        [22.5800, 88.4400], // Elevated expressway
        [22.6250, 88.4600],
        [22.6540, 88.4460]
      ]
    }
  }
};

// Crowdsourced initial pins
export const INITIAL_CROWD_REPORTS = [
  {
    id: 'cr-1',
    cityName: 'Kolkata',
    coords: [22.5835, 88.4020],
    locationName: 'Ultadanga Underpass',
    waterDepth: '50-60 cm (Thigh Deep)',
    vehicleStuck: true,
    reportedBy: 'Rohan (Delivery Worker)',
    timeAgo: '12 mins ago',
    votes: 14,
    notes: 'Knee-deep water under rail bridge. Cars turning back!'
  },
  {
    id: 'cr-2',
    cityName: 'Kolkata',
    coords: [22.5725, 88.3630],
    locationName: 'Amherst St Junction',
    waterDepth: '30 cm (Wheel Level)',
    vehicleStuck: false,
    reportedBy: 'Priya M.',
    timeAgo: '25 mins ago',
    votes: 8,
    notes: 'Drain overflowing, slow moving traffic. Motorcyclists be careful.'
  }
];
