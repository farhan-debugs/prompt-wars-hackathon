import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, MapPin, Navigation, Info, Droplets } from 'lucide-react';
import { FLOOD_ZONES } from '../data/mockFloodData';

const createCustomIcon = (color, label) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${color};
        color: #0f172a;
        font-weight: 800;
        font-size: 11px;
        padding: 4px 8px;
        border-radius: 20px;
        box-shadow: 0 0 15px ${color};
        border: 2px solid white;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
      ">
        <span>${label}</span>
      </div>
    `,
    iconSize: [80, 30],
    iconAnchor: [40, 15]
  });
};

const originIcon = createCustomIcon('#10b981', 'Origin 📍');
const destIcon = createCustomIcon('#38bdf8', 'Destination 🏁');

const hazardIcon = L.divIcon({
  className: 'custom-hazard-marker',
  html: `
    <div style="
      background: #f43f5e;
      color: white;
      padding: 6px;
      border-radius: 50%;
      box-shadow: 0 0 15px rgba(244,63,94,0.8);
      border: 2px solid white;
      animation: pulse-slow 2s infinite;
    ">
      ⚠️
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ 
  activeCity, 
  routeData, 
  selectedRouteId, 
  onSelectRoute,
  crowdReports,
  showWeatherRadar
}) {
  const cityZones = FLOOD_ZONES[activeCity.id] || FLOOD_ZONES.kolkata;

  return (
    <div className="relative w-full h-[360px] rounded-2xl overflow-hidden glass-panel border border-slate-800 shadow-xl">
      
      {/* Map Header Status Bar */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-2">
        <div className="glass-panel px-2.5 py-1 rounded-xl text-[11px] font-semibold text-slate-200 flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Spatial Hazard Overlay</span>
        </div>
      </div>

      <MapContainer
        center={activeCity.center}
        zoom={activeCity.zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapRecenter center={activeCity.center} zoom={activeCity.zoom} />

        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {cityZones.map((zone) => {
          const isHigh = zone.severity === 'HIGH';
          return (
            <Polygon
              key={zone.id}
              positions={zone.coordinates}
              pathOptions={{
                color: isHigh ? '#f43f5e' : '#f59e0b',
                fillColor: isHigh ? '#f43f5e' : '#f59e0b',
                fillOpacity: isHigh ? 0.45 : 0.3,
                weight: isHigh ? 3 : 2,
                dashArray: isHigh ? '6, 6' : null
              }}
            >
              <Popup>
                <div className="p-1 max-w-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1">
                    <span className="font-extrabold text-sm text-slate-100">{zone.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isHigh ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'}`}>
                      {zone.severity} RISK
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Water Depth: <strong className="text-rose-400">{zone.waterDepthCm} cm</strong></span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{zone.description}</p>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {routeData && routeData.routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          const isSafe = route.riskLevel === 'LOW';
          const isHighRisk = route.riskLevel === 'HIGH';

          let lineColor = isSafe ? '#10b981' : isHighRisk ? '#f43f5e' : '#f59e0b';
          if (!isSelected) lineColor = '#64748b';

          return (
            <Polyline
              key={route.id}
              positions={route.coordinates}
              pathOptions={{
                color: lineColor,
                weight: isSelected ? (isSafe ? 6 : 5) : 3,
                opacity: isSelected ? 0.95 : 0.4,
                dashArray: isHighRisk ? '10, 10' : null
              }}
              eventHandlers={{
                click: () => onSelectRoute(route.id)
              }}
            >
              <Popup>
                <div className="p-1 space-y-1">
                  <strong className="text-xs font-bold text-slate-100">{route.name}</strong>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span>{route.distanceKm} km</span>
                    <span>•</span>
                    <span>{route.etaMins} mins</span>
                    <span>•</span>
                    <span className={isSafe ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      Risk Score: {route.riskScore}/100
                    </span>
                  </div>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {routeData && (
          <>
            <Marker position={routeData.originCoords} icon={originIcon}>
              <Popup><div className="text-xs font-bold p-1">Start: {routeData.originName}</div></Popup>
            </Marker>

            <Marker position={routeData.destinationCoords} icon={destIcon}>
              <Popup><div className="text-xs font-bold p-1">End: {routeData.destinationName}</div></Popup>
            </Marker>
          </>
        )}

        {crowdReports.map((report) => (
          <Marker key={report.id} position={report.coords} icon={hazardIcon}>
            <Popup>
              <div className="p-1 space-y-1 max-w-xs">
                <div className="flex items-center justify-between gap-1 text-rose-400 font-bold text-xs">
                  <span>⚠️ Citizen Hazard Report</span>
                  <span className="text-[10px] text-slate-400">{report.timeAgo}</span>
                </div>
                <div className="text-xs text-slate-200 font-semibold">{report.locationName}</div>
                <div className="text-xs text-amber-300">Depth: {report.waterDepth}</div>
                <p className="text-[11px] text-slate-400 italic">"{report.notes}"</p>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>

      {/* Compact Map Legend */}
      <div className="absolute bottom-3 left-3 z-[400] glass-panel p-2 rounded-xl text-[10px] space-y-0.5 shadow-xl border-slate-800">
        <div className="text-emerald-400 flex items-center gap-1">🟢 Safe Detour</div>
        <div className="text-rose-400 flex items-center gap-1">🔴 Flooded Path</div>
        <div className="text-amber-400 flex items-center gap-1">⚠️ Submerged Zone</div>
      </div>

    </div>
  );
}
