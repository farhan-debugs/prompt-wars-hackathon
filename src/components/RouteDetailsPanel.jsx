import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Clock, Route, CheckCircle2, ChevronRight, Info, Sparkles, Droplets, Zap } from 'lucide-react';

export default function RouteDetailsPanel({ 
  routeData, 
  selectedRouteId, 
  onSelectRoute,
  safetyExplanation 
}) {
  const [showExplanation, setShowExplanation] = useState(true);

  if (!routeData || !routeData.routes) return null;

  return (
    <div className="w-full space-y-4">
      
      {/* Header Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Route className="w-5 h-5 text-cyan-400" />
            <span>Route Risk Analysis & Alternatives</span>
          </h2>
          <p className="text-xs text-slate-400">
            Comparing direct path vs. AI risk-avoidance detour
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          {routeData.routes.length} Candidate Routes Evaluated
        </span>
      </div>

      {/* Candidate Route Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {routeData.routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          const isSafe = route.riskLevel === 'LOW';
          const isHighRisk = route.riskLevel === 'HIGH';

          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute(route.id)}
              className={`p-4 rounded-2xl glass-panel cursor-pointer transition-all border relative overflow-hidden ${
                isSelected
                  ? isSafe
                    ? 'border-emerald-500/80 bg-slate-900/95 ring-2 ring-emerald-500/20 shadow-xl shadow-emerald-500/10'
                    : 'border-rose-500/80 bg-slate-900/95 ring-2 ring-rose-500/20 shadow-xl shadow-rose-500/10'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              {/* Recommended Badge */}
              {isSafe && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-extrabold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider shadow-md">
                  ★ RECOMMENDED SAFE DETOUR
                </div>
              )}

              {/* Title & Risk Badge */}
              <div className="flex items-start justify-between gap-2 mb-2 pr-12">
                <div>
                  <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                    {isSafe ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                    <span>{route.name}</span>
                  </h3>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 my-3 py-2 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase">ETA</div>
                  <div className="font-extrabold text-sm text-slate-100 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{route.etaMins} min</span>
                  </div>
                </div>

                <div className="h-6 w-px bg-slate-800"></div>

                <div>
                  <div className="text-slate-400 text-[10px] uppercase">Distance</div>
                  <div className="font-extrabold text-sm text-slate-100">{route.distanceKm} km</div>
                </div>

                <div className="h-6 w-px bg-slate-800"></div>

                <div>
                  <div className="text-slate-400 text-[10px] uppercase">Flood Risk Score</div>
                  <div className={`font-extrabold text-sm flex items-center gap-1 ${
                    isSafe ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    <span>{route.riskScore}/100</span>
                    <span className="text-[10px] font-normal uppercase">({route.riskLevel})</span>
                  </div>
                </div>
              </div>

              {/* Hazards list */}
              {route.intersectedZones && route.intersectedZones.length > 0 ? (
                <div className="text-xs text-rose-400 space-y-1 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
                  <div className="font-semibold flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{route.intersectedZones.length} Submerged Hazards Intersected:</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-rose-300 space-y-0.5">
                    {route.intersectedZones.map((zone, i) => (
                      <li key={i}>{zone} ({route.maxWaterDepth})</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="font-medium text-[11px]">Zero high-risk flood polygons intersected on elevated bypass path.</span>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* "Explain This Risk" Plain-Language AI Reasoning Card */}
      {safetyExplanation && (
        <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 space-y-2 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <span>Explain This Risk — AI Reasoning Note</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                    LLM Safety Guidance
                  </span>
                </h3>
              </div>
            </div>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs text-slate-400 hover:text-cyan-400 font-medium"
            >
              {showExplanation ? 'Hide' : 'Show Explanation'}
            </button>
          </div>

          {showExplanation && (
            <div className="space-y-2 text-xs leading-relaxed pt-1">
              <p className="font-semibold text-slate-200 text-sm">
                {safetyExplanation.summary}
              </p>
              <p className="text-slate-300">
                {safetyExplanation.detailText}
              </p>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium flex items-start gap-2">
                <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{safetyExplanation.recommendation}</span>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
