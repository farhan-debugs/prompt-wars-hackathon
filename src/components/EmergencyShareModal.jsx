import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, PhoneCall, ShieldAlert, Share2 } from 'lucide-react';

export default function EmergencyShareModal({ isOpen, onClose, routeData, rainLevel }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !routeData) return null;

  const safeRoute = routeData.routes.find(r => r.riskLevel === 'LOW') || routeData.routes[0];
  const directRoute = routeData.routes.find(r => r.riskLevel === 'HIGH') || routeData.routes[1];

  const smsTextPayload = `[FLOODWISE EMERGENCY ROUTE ALERT]
From: ${routeData.originName}
To: ${routeData.destinationName}

RECOMMENDED ROUTE: ${safeRoute.name}
ETA: ${safeRoute.etaMins} mins (${safeRoute.distanceKm} km)
Risk Level: LOW (Score: ${safeRoute.riskScore}/100)

HAZARD WARNING:
Avoid ${directRoute?.name || 'Direct Route'} due to ${directRoute?.maxWaterDepth || '30cm+'} waterlogging at ${directRoute?.intersectedZones[0] || 'low areas'}.

Shared via FloodWise Emergency Response AI.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(smsTextPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(smsTextPayload)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl glass-panel border border-slate-700 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Share2 className="w-5 h-5" />
            <h2 className="text-lg font-extrabold text-slate-100">Emergency Offline / SMS Share</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Send instant flood safety directions via SMS or WhatsApp to family members, delivery riders, or citizens using feature phones without active mobile data.
        </p>

        {/* Text Payload Preview Box */}
        <div className="relative p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto">
          <pre className="whitespace-pre-wrap font-sans">{smsTextPayload}</pre>

          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copy Payload</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Disaster Helpline: <strong className="text-slate-200">1070 / 112</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
