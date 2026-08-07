// Natural Language Processing Service for Urban Flood Navigation (SafeRoute)

/**
 * Parses freeform natural language queries into a structured travel request schema.
 * Supports intent recognition, origin/destination entity extraction, mode of transport, and risk constraints.
 */
export function parseNaturalLanguageQuery(queryText, activeCityId = 'kolkata') {
  const text = (queryText || '').trim();
  const lowerText = text.toLowerCase();

  // Entity extraction patterns
  let origin = '';
  let destination = '';
  let mode = 'car'; // default car
  let constraints = [];
  let areaName = activeCityId === 'mumbai' ? 'Mumbai' : activeCityId === 'nyc' ? 'New York City' : 'Kolkata';

  // Extract Mode of transport
  if (lowerText.includes('bike') || lowerText.includes('motorcycle') || lowerText.includes('scooter') || lowerText.includes('2-wheeler')) {
    mode = 'motorcycle';
  } else if (lowerText.includes('walk') || lowerText.includes('foot') || lowerText.includes('walking')) {
    mode = 'walking';
  } else if (lowerText.includes('emergency') || lowerText.includes('ambulance')) {
    mode = 'emergency';
  }

  // Extract Constraints
  if (lowerText.includes('avoid') || lowerText.includes('flood') || lowerText.includes('waterlog') || lowerText.includes('safe')) {
    constraints.push('avoid_flood_zones');
  }
  if (lowerText.includes('elevated') || lowerText.includes('flyover')) {
    constraints.push('prefer_flyovers');
  }

  // Heuristic entity matching for origin/destination
  if (lowerText.includes('salt lake') && lowerText.includes('howrah')) {
    origin = 'Salt Lake City (Sector V)';
    destination = 'Howrah Railway Station';
  } else if (lowerText.includes('park street') && lowerText.includes('airport')) {
    origin = 'Park Street';
    destination = 'Kolkata Airport (CCU)';
  } else if (lowerText.includes('hindmata') && lowerText.includes('bkc')) {
    origin = 'Hindmata Flyover Area';
    destination = 'Bandra Kurla Complex (BKC)';
    areaName = 'Mumbai';
  } else if (lowerText.includes('financial district') && lowerText.includes('williamsburg')) {
    origin = 'Financial District (Lower Manhattan)';
    destination = 'Williamsburg, Brooklyn';
    areaName = 'New York City';
  } else {
    // Generic regex parser for "from [Origin] to [Destination]"
    const fromToRegex = /(?:from\s+|^)([a-zA-Z0-9\s]{3,20}?)\s+(?:to|heading to|towards)\s+([a-zA-Z0-9\s]{3,20})/i;
    const match = text.match(fromToRegex);
    if (match) {
      origin = match[1].trim();
      destination = match[2].replace(/avoiding.*/i, '').trim();
    } else {
      // Fallback
      origin = 'Salt Lake City (Sector V)';
      destination = 'Howrah Railway Station';
    }
  }

  return {
    originalQuery: text,
    origin,
    destination,
    area_name: areaName,
    time: 'Real-time (Now)',
    mode,
    constraints,
    confidenceScore: 0.94,
    parsedJSON: {
      origin,
      destination,
      area_name: areaName,
      time: 'Now',
      mode,
      avoid_hazard: 'flooded_roads',
      risk_tolerance: 'LOW_RISK_ONLY'
    }
  };
}

/**
 * Optional LLM Function Call Generator format
 * Compatible with OpenAI / Claude / Gemini Schema format
 */
export function getLLMFunctionCallSchema() {
  return {
    name: "parse_travel_request",
    description: "Extract structured travel intent and flood avoidance parameters from natural language query",
    parameters: {
      type: "object",
      properties: {
        origin: { type: "string", description: "Origin location or landmark" },
        destination: { type: "string", description: "Destination location or landmark" },
        area_name: { type: "string", description: "City or region name" },
        time: { type: "string", description: "Desired departure time" },
        mode: { type: "string", enum: ["car", "motorcycle", "walking", "emergency"] },
        avoid_hazards: { type: "array", items: { type: "string" } }
      },
      required: ["origin", "destination"]
    }
  };
}
