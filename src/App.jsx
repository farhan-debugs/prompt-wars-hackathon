import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import NaturalLanguageInput from './components/NaturalLanguageInput';
import MapView from './components/MapView';
import RouteDetailsPanel from './components/RouteDetailsPanel';
import ReportFloodModal from './components/ReportFloodModal';
import EmergencyShareModal from './components/EmergencyShareModal';

import { CITIES, INITIAL_CROWD_REPORTS } from './data/mockFloodData';
import { parseNaturalLanguageQuery } from './services/nlpService';
import { calculateRoutesAndRisk } from './services/routingService';
import { getMockWeatherData } from './services/weatherService';

import { ShieldCheck, Waves, AlertCircle, Sparkles, Navigation, Droplets, MapPin } from 'lucide-react';

export default function App() {
  const [activeCity, setActiveCity] = useState(CITIES[0]);
  const [queryText, setQueryText] = useState("How do I get from Salt Lake to Howrah avoiding flooded roads?");
  const [selectedMode, setSelectedMode] = useState('car');
  const [rainLevel, setRainLevel] = useState('heavy');
  
  const [parsedResult, setParsedResult] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  
  const [crowdReports, setCrowdReports] = useState(INITIAL_CROWD_REPORTS);
  const [showWeatherRadar, setShowWeatherRadar] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const weatherData = getMockWeatherData(activeCity.name);

  const executeSearch = (textToQuery, cityObj = activeCity, mode = selectedMode, rain = rainLevel) => {
    const parsed = parseNaturalLanguageQuery(textToQuery, cityObj.id);
    parsed.mode = mode;
    setParsedResult(parsed);

    const routesResult = calculateRoutesAndRisk(parsed, rain, crowdReports);
    setRouteData(routesResult);
    setSelectedRouteId(routesResult.recommendedRouteId);
  };

  useEffect(() => {
    executeSearch(queryText, activeCity, selectedMode, rainLevel);
  }, []);

  const handleCityChange = (cityId) => {
    const found = CITIES.find(c => c.id === cityId) || CITIES[0];
    setActiveCity(found);
    let defaultText = "How do I get from Salt Lake to Howrah avoiding flooded roads?";
    if (cityId === 'mumbai') defaultText = "Navigate from Hindmata to BKC avoiding waterlogged spots";
    if (cityId === 'nyc') defaultText = "Route from Financial District to Williamsburg avoiding storm surge areas";
    setQueryText(defaultText);
    executeSearch(defaultText, found, selectedMode, rainLevel);
  };

  const handleModeChange = (newMode) => {
    setSelectedMode(newMode);
    executeSearch(queryText, activeCity, newMode, rainLevel);
  };

  const handleRainLevelChange = (newRain) => {
    setRainLevel(newRain);
    executeSearch(queryText, activeCity, selectedMode, newRain);
  };

  const handleAddCrowdReport = (newReport) => {
    setCrowdReports([newReport, ...crowdReports]);
    executeSearch(queryText, activeCity, selectedMode, rainLevel);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        activeCity={activeCity}
        onCityChange={handleCityChange}
        weather={weatherData}
        rainLevel={rainLevel}
        onRainLevelChange={handleRainLevelChange}
        onOpenReportModal={() => setShowReportModal(true)}
        onOpenShareModal={() => setShowShareModal(true)}
        showWeatherRadar={showWeatherRadar}
        onToggleWeatherRadar={() => setShowWeatherRadar(!showWeatherRadar)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        
        {/* Banner Alert Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl glass-panel border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-rose-500/10 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertCircle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs uppercase tracking-wider text-amber-400">Monsoon Weather Alert</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  {weatherData.precipitationRate} Rain Rate
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                {weatherData.alert}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Waterlogging Risk: <strong className="text-rose-400">HIGH</strong></span>
          </div>
        </div>

        {/* Natural Language Search Section */}
        <NaturalLanguageInput
          queryText={queryText}
          setQueryText={setQueryText}
          onSearch={(text) => executeSearch(text, activeCity, selectedMode, rainLevel)}
          parsedResult={parsedResult}
          activeCity={activeCity}
          selectedMode={selectedMode}
          setSelectedMode={handleModeChange}
        />

        {/* 1. MAP VIEW (TOP SECTION - FULL WIDTH) */}
        <div className="w-full">
          <MapView
            activeCity={activeCity}
            routeData={routeData}
            selectedRouteId={selectedRouteId}
            onSelectRoute={setSelectedRouteId}
            crowdReports={crowdReports}
            showWeatherRadar={showWeatherRadar}
          />
        </div>

        {/* 2. ROUTE DETAILS & RISK COMPARISON (BOTTOM SECTION - DIRECTLY BELOW MAP) */}
        <div className="w-full pt-2">
          <RouteDetailsPanel
            routeData={routeData}
            selectedRouteId={selectedRouteId}
            onSelectRoute={setSelectedRouteId}
            safetyExplanation={routeData?.safetyExplanation}
          />
        </div>

      </main>

      {/* Crowdsourcing Report Modal */}
      <ReportFloodModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmitReport={handleAddCrowdReport}
        activeCity={activeCity}
      />

      {/* Emergency SMS/WhatsApp Share Modal */}
      <EmergencyShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        routeData={routeData}
        rainLevel={rainLevel}
      />

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">FloodWise</span>
            <span>— Societal Benefit Urban Flood Navigation System</span>
          </div>
          <div className="text-slate-400">
            Powered by React • Leaflet • Turf.js Spatial Analysis • Natural Language Function Calling
          </div>
        </div>
      </footer>

    </div>
  );
}
