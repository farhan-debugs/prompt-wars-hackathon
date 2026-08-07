// Weather Service for FloodWise

export const RAIN_LEVELS = [
  { id: 'light', label: 'Light Drizzle', intensity: '5 mm/hr', riskMultiplier: 0.8, color: 'text-cyan-400' },
  { id: 'moderate', label: 'Moderate Rain', intensity: '18 mm/hr', riskMultiplier: 1.1, color: 'text-blue-400' },
  { id: 'heavy', label: 'Heavy Downpour', intensity: '45 mm/hr', riskMultiplier: 1.4, color: 'text-amber-400' },
  { id: 'downpour', label: 'Torrential Storm', intensity: '85 mm/hr', riskMultiplier: 1.8, color: 'text-rose-400' }
];

export function getMockWeatherData(cityName = 'Kolkata') {
  return {
    city: cityName,
    temperature: '28°C',
    humidity: '94%',
    precipitationRate: '45 mm/hr',
    windSpeed: '24 km/h',
    rainCondition: 'Heavy Downpour',
    alert: 'Red Alert: Severe urban waterlogging warning active until 21:00 IST.',
    lastUpdated: 'Live (2 mins ago)'
  };
}
