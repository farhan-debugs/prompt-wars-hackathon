import React, { useState } from 'react';
import { X, AlertTriangle, MapPin, Droplets, Send, Camera, ShieldAlert } from 'lucide-react';

export default function ReportFloodModal({ isOpen, onClose, onSubmitReport, activeCity }) {
  const [locationName, setLocationName] = useState('Ultadanga Flyover Cut');
  const [waterDepth, setWaterDepth] = useState('45 cm (Knee-deep water)');
  const [vehicleStuck, setVehicleStuck] = useState(true);
  const [notes, setNotes] = useState('Drain gushing onto main lane. Water level rising fast!');
  const [reporterName, setReporterName] = useState('Citizen Commuter');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReport = {
      id: 'cr-' + Date.now(),
      cityName: activeCity.name,
      coords: [activeCity.center[0] + (Math.random() - 0.5) * 0.03, activeCity.center[1] + (Math.random() - 0.5) * 0.03],
      locationName: locationName || 'Reported Flood Location',
      waterDepth,
      vehicleStuck,
      reportedBy: reporterName || 'Anonymous',
      timeAgo: 'Just now',
      votes: 1,
      notes
    };
    onSubmitReport(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl glass-panel border border-slate-700 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <h2 className="text-lg font-extrabold text-slate-100">Report Flooded Road (Crowdsource)</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Location Name */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Location / Landmark Name
            </label>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Sector V Underpass or College St Junction"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Water Depth Selector */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Estimated Water Depth
            </label>
            <select
              value={waterDepth}
              onChange={(e) => setWaterDepth(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="15 cm (Ankle-deep)">15 cm (Ankle-deep — passable slowly)</option>
              <option value="35 cm (Wheel level)">35 cm (Wheel level — bike engine stall risk)</option>
              <option value="45 cm (Knee-deep water)">45 cm (Knee-deep — hazardous for sedans)</option>
              <option value="75 cm+ (Submerged waist-deep)">75 cm+ (Waist deep — impassable for all vehicles)</option>
            </select>
          </div>

          {/* Vehicle Stuck Checkbox */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <input
              type="checkbox"
              id="stuck"
              checked={vehicleStuck}
              onChange={(e) => setVehicleStuck(e.target.checked)}
              className="w-4 h-4 text-rose-500 rounded bg-slate-950 border-slate-700 focus:ring-rose-500"
            />
            <label htmlFor="stuck" className="text-slate-200 font-medium cursor-pointer">
              Vehicles or ambulances currently stuck here
            </label>
          </div>

          {/* Notes / Description */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Notes / Safety Warning for Other Drivers</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe road conditions, open manholes, or detours..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Reporter Handle */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-400">Your Name / Handle (Optional)</label>
            <input
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold shadow-lg shadow-rose-600/30 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Flood Alert</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
