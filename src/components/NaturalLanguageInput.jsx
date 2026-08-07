import React, { useState, useEffect } from 'react';
import { Search, Mic, MicOff, Sparkles, Navigation, Code2, ChevronDown, ChevronUp, Bike, Car, Footprints, ShieldAlert } from 'lucide-react';
import { PRESET_QUERIES } from '../data/mockFloodData';

export default function NaturalLanguageInput({ 
  queryText, 
  setQueryText, 
  onSearch, 
  parsedResult,
  activeCity,
  selectedMode,
  setSelectedMode
}) {
  const [isListening, setIsListening] = useState(false);
  const [showJsonDrawer, setShowJsonDrawer] = useState(false);

  // Handle Speech Recognition API if supported by browser
  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQueryText(transcript);
        setIsListening(false);
        onSearch(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      // Speech recognition fallback simulation for browser environments
      setIsListening(true);
      setTimeout(() => {
        const simulatedVoice = "How do I get from Salt Lake to Howrah avoiding flooded roads?";
        setQueryText(simulatedVoice);
        setIsListening(false);
        onSearch(simulatedVoice);
      }, 1500);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (queryText.trim()) {
      onSearch(queryText);
    }
  };

  const cityPresets = PRESET_QUERIES.filter(q => q.cityId === activeCity.id || activeCity.id === 'kolkata');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center rounded-2xl glass-panel p-2 shadow-2xl transition-all border border-slate-700/60 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20">
          
          <div className="pl-3 pr-2 text-cyan-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="e.g., How do I get from Salt Lake to Howrah avoiding flooded roads?"
            className="w-full bg-transparent py-2.5 px-2 text-sm sm:text-base text-slate-100 placeholder-slate-400 focus:outline-none font-medium"
          />

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2.5 rounded-xl transition-all mr-2 flex items-center gap-1 text-xs font-semibold ${
              isListening
                ? 'bg-rose-500 text-white animate-bounce shadow-lg shadow-rose-500/40'
                : 'bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700'
            }`}
            title="Speak your travel request"
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 animate-pulse" />
                <span className="hidden sm:inline">Listening...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline text-slate-300">Voice</span>
              </>
            )}
          </button>

          {/* Submit Search Button */}
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Navigation className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Route</span>
          </button>
        </div>
      </form>

      {/* Preset Pills & Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        
        {/* Preset Query Badges */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Try Demo NLP Queries:</span>
          {cityPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQueryText(preset.text);
                onSearch(preset.text);
              }}
              className="px-2.5 py-1 rounded-lg glass-pill text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all text-xs font-medium flex items-center gap-1 bg-slate-900/60"
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        {/* Transport Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setSelectedMode('car')}
            className={`p-1.5 rounded-lg flex items-center gap-1 ${selectedMode === 'car' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}`}
            title="Car / Cab"
          >
            <Car className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Car</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedMode('motorcycle')}
            className={`p-1.5 rounded-lg flex items-center gap-1 ${selectedMode === 'motorcycle' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}`}
            title="Two-Wheeler / Bike"
          >
            <Bike className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Bike</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedMode('walking')}
            className={`p-1.5 rounded-lg flex items-center gap-1 ${selectedMode === 'walking' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}`}
            title="Pedestrian"
          >
            <Footprints className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Walk</span>
          </button>
        </div>

      </div>

      {/* Structured Intent Drawer Toggle for Judging */}
      {parsedResult && (
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden">
          <button
            onClick={() => setShowJsonDrawer(!showJsonDrawer)}
            className="w-full px-4 py-2 flex items-center justify-between text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <div className="flex items-center gap-2 font-mono">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Parsed Intent JSON: <strong className="text-cyan-300">{parsedResult.origin} ➔ {parsedResult.destination}</strong></span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px]">
                Confidence: {(parsedResult.confidenceScore * 100).toFixed(0)}%
              </span>
            </div>
            {showJsonDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showJsonDrawer && (
            <div className="p-3 bg-slate-950 border-t border-slate-800/80 text-xs font-mono overflow-x-auto text-emerald-400">
              <pre>{JSON.stringify(parsedResult.parsedJSON, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
