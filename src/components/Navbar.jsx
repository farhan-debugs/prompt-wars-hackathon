import React from 'react';
import { Waves, CloudRain, AlertTriangle, Share2, PlusCircle, Shield, MapPin } from 'lucide-react';
import { CITIES } from '../data/mockFloodData';

export default function Navbar({ 
  activeCity, 
  onCityChange, 
  weather, 
  rainLevel, 
  onRainLevelChange,
  onOpenReportModal, 
  onOpenShareModal,
  showWeatherRadar,
  onToggleWeatherRadar
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 shadow-lg shadow-cyan-500/20">
              <Waves className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  FloodWise
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 uppercase tracking-widest">
                  Live Safety AI
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" /> Urban Flood Risk Aware Routing
              </p>
            </div>
          </div>

          {/* Mobile City Selector */}
          <div className="md:hidden flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <select 
              value={activeCity.id} 
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-slate-900 text-xs border border-slate-700 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Live Weather Indicator & Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          {/* City Switcher Desktop */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">City:</span>
            <select 
              value={activeCity.id} 
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent font-medium text-slate-100 focus:outline-none cursor-pointer"
            >
              {CITIES.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
            </select>
          </div>

          {/* Rain Intensity Selector */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <CloudRain className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-slate-400 hidden sm:inline">Downpour:</span>
            <select 
              value={rainLevel} 
              onChange={(e) => onRainLevelChange(e.target.value)}
              className="bg-transparent font-semibold text-cyan-300 focus:outline-none cursor-pointer"
            >
              <option value="light" className="bg-slate-900 text-slate-200">Light (5mm/h)</option>
              <option value="moderate" className="bg-slate-900 text-slate-200">Moderate (18mm/h)</option>
              <option value="heavy" className="bg-slate-900 text-slate-200">Heavy (45mm/h)</option>
              <option value="downpour" className="bg-slate-900 text-slate-200">Torrential (85mm/h)</option>
            </select>
          </div>

          {/* Radar Overlay Toggle */}
          <button
            onClick={onToggleWeatherRadar}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition-all ${
              showWeatherRadar 
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10' 
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Live Rain Radar Overlay"
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rain Radar</span>
          </button>

          {/* Report Hazard Pin Button */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-lg shadow-rose-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Flood</span>
          </button>

          {/* Emergency Share Button */}
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-cyan-400 transition-all"
            title="Export SMS/WhatsApp route directions"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Emergency Share</span>
          </button>

        </div>
      </div>
    </header>
  );
}
